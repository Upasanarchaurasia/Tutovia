#!/usr/bin/env bash
for pid in 9969 9989 12433 12434 12435 12436 12437 12438 12439 12440 14378 14379 17838 17839 18132 18133 19230 20387; do
  out=$(curl -s -L "https://www.icai.org/post/$pid")
  title=$(echo "$out" | grep -i '<h2' | head -n 1 | sed -e 's/<[^>]*>//g' | tr -d '\r\n')
  if [ -z "$title" ]; then
    title=$(echo "$out" | grep -i '<title>' | head -n 1 | sed -e 's/<[^>]*>//g' | tr -d '\r\n')
  fi
  pdf_count=$(echo "$out" | grep -o 'https://resource.cdn.icai.org/[^" <]*\.pdf' | wc -l)
  if [ "$pdf_count" -gt 0 ]; then
    echo "POST $pid: [$title] -> $pdf_count PDFs"
    echo "$out" | grep -o 'https://resource.cdn.icai.org/[^" <]*\.pdf' | head -n 3
  fi
done
