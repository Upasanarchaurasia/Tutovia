import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';

function resolveGitBinary() {
  const candidates = [
    'git',
    'C:\\Program Files\\Git\\cmd\\git.exe',
    'C:\\Program Files\\Git\\bin\\git.exe',
    path.join(process.env.LOCALAPPDATA || '', 'Programs', 'Git', 'cmd', 'git.exe')
  ];

  // Also search GitHub Desktop embedded git if installed
  const ghDesktopDir = path.join(process.env.LOCALAPPDATA || '', 'GitHubDesktop');
  if (fs.existsSync(ghDesktopDir)) {
    try {
      const entries = fs.readdirSync(ghDesktopDir).filter((d) => d.startsWith('app-')).sort().reverse();
      for (const appDir of entries) {
        const candidate = path.join(ghDesktopDir, appDir, 'resources', 'app', 'git', 'cmd', 'git.exe');
        if (fs.existsSync(candidate)) {
          candidates.splice(1, 0, candidate);
        }
      }
    } catch {
      // ignore
    }
  }

  for (const bin of candidates) {
    try {
      execFileSync(bin, ['--version'], { stdio: 'ignore' });
      return bin;
    } catch {
      // try next
    }
  }

  throw new Error('Git executable not found. Please ensure Git or GitHub Desktop is installed.');
}

const GIT = resolveGitBinary();

function runGit(args, options = {}) {
  return execFileSync(GIT, args, {
    encoding: 'utf8',
    stdio: options.stdio || 'pipe',
    cwd: process.cwd()
  }).trim();
}

const [, , command = 'list', rawVersion, ...msgParts] = process.argv;

if (command === 'list') {
  console.log('\n======================================================');
  console.log('  TUTOVIA — SAVED GIT VERSIONS & RELEASE BRANCHES');
  console.log('======================================================\n');

  const tagsOutput = runGit([
    'tag',
    '-l',
    '--sort=-creatordate',
    '--format=%(refname:short)|%(objectname:short)|%(creatordate:short)|%(contents:subject)'
  ]);

  if (!tagsOutput) {
    console.log('No version tags found yet.');
  } else {
    console.log('Tag          Commit    Date         Description');
    console.log('-----------  --------  -----------  --------------------------------------------');
    for (const line of tagsOutput.split('\n')) {
      const [tag, hash, date, subject] = line.split('|');
      console.log(
        `${(tag || '').padEnd(11)}  ${(hash || '').padEnd(8)}  ${(date || '').padEnd(11)}  ${subject || ''}`
      );
    }
  }

  console.log('\nRelease Branches:');
  const branches = runGit(['branch', '-a', '--list', '*release/*']);
  console.log(branches || '  (none)');
  console.log('\n======================================================\n');
} else if (command === 'save') {
  if (!rawVersion) {
    console.error('Usage: npm run version:save -- <version> ["Release description"]');
    process.exit(1);
  }

  const versionTag = rawVersion.startsWith('v') ? rawVersion : `v${rawVersion}`;
  const releaseBranch = `release/${versionTag}`;
  const description = msgParts.join(' ').trim() || `Tutovia release snapshot ${versionTag}`;

  console.log(`[1/4] Staging project files for ${versionTag}...`);
  runGit(['add', '-A'], { stdio: 'inherit' });

  const status = runGit(['status', '--porcelain']);
  if (status) {
    console.log(`[2/4] Committing changes: "release(${versionTag}): ${description}"...`);
    runGit(['commit', '-m', `release(${versionTag}): ${description}`], { stdio: 'inherit' });
  } else {
    console.log('[2/4] Working tree clean; tagging current HEAD commit...');
  }

  console.log(`[3/4] Creating annotated tag "${versionTag}" and branch "${releaseBranch}"...`);
  runGit(['tag', '-a', versionTag, '-f', '-m', `${versionTag} — ${description}`], { stdio: 'inherit' });
  runGit(['branch', '-f', releaseBranch, 'HEAD'], { stdio: 'inherit' });

  console.log(`[4/4] Pushing main, ${releaseBranch}, and tag ${versionTag} to GitHub (origin)...`);
  runGit(['push', 'origin', 'HEAD:main', '--force-with-lease'], { stdio: 'inherit' });
  runGit(['push', 'origin', releaseBranch, '--force'], { stdio: 'inherit' });
  runGit(['push', 'origin', `refs/tags/${versionTag}`, '--force'], { stdio: 'inherit' });

  console.log(`\n✅ Version ${versionTag} is permanently saved and pushed to GitHub!`);
} else if (command === 'checkout') {
  if (!rawVersion) {
    console.error('Usage: npm run version:checkout -- <version>');
    process.exit(1);
  }
  const versionTag = rawVersion.startsWith('v') ? rawVersion : `v${rawVersion}`;
  console.log(`Checking out version ${versionTag}...`);
  runGit(['checkout', versionTag], { stdio: 'inherit' });
} else if (command === 'sync') {
  console.log('Syncing all local branches and version tags to GitHub (origin)...');
  runGit(['push', 'origin', '--all'], { stdio: 'inherit' });
  runGit(['push', 'origin', '--tags', '--force'], { stdio: 'inherit' });
  console.log('✅ All branches and tags synced to GitHub!');
} else {
  console.log('Available commands: list | save <version> [msg] | checkout <version> | sync');
}
