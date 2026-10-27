// Rebuild lightweight CDN copies of the existing admin music library.
import { createRequire } from 'node:module';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const require = createRequire(import.meta.url);
require('@next/env').loadEnvConfig(process.cwd());
const { createClient } = require('@supabase/supabase-js');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const { data, error } = await db.from('music_tracks').select('id,title,file_url').order('title');
if (error) throw error;
const cache = process.env.AUDIO_SOURCE_CACHE || join(tmpdir(), 'oila-music-optimization');
await mkdir(cache, { recursive: true }); await mkdir('public/audio', { recursive: true });
const manifest = {};
for (const track of data) {
  if (!/^https:\/\//.test(track.file_url)) continue;
  const response = await fetch(track.file_url);
  if (!response.ok) throw Error(`Audio ${track.id}: ${response.status}`);
  const input = new Uint8Array(await response.arrayBuffer());
  const original = `${cache}/${track.id}`;
  await writeFile(original, input);
  const temporary = `${cache}/${track.id}.m4a`;
  await new Promise((resolve, reject) => {
    const process = spawn('ffmpeg', ['-y','-v','error','-i',original,'-vn','-map_metadata','-1','-ac','2','-ar','44100','-c:a','aac','-b:a','96k','-movflags','+faststart',temporary], { stdio: ['ignore','ignore','pipe'] });
    let error = ''; process.stderr.on('data', chunk => error += chunk);
    process.on('error', reject); process.on('exit', code => code ? reject(Error(error)) : resolve());
  });
  const audio = await readFile(temporary);
  const hash = createHash('sha256').update(audio).digest('hex').slice(0,12);
  const path = `/audio/${track.id}-${hash}.m4a`;
  await writeFile(`public${path}`, audio);
  manifest[track.id] = { source: track.file_url, path, originalBytes: input.length, bytes: audio.length };
  console.log(`${track.title}: ${input.length} -> ${audio.length} bytes`);
}
await writeFile('public/audio/manifest.json', JSON.stringify(manifest, null, 2)+'\n');
