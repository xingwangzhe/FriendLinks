import YAML from 'yaml';
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
const root='reports/blog-review-100-2026-10-02/recheck';
const rounds=['first-cleanup.json','second-cleanup.json'].map(f=>JSON.parse(readFileSync(root+'/'+f,'utf8')));
const deleted=new Set(rounds.flatMap(r=>r.deleted.map(x=>x.file)));
const allowed=new Set(rounds.flatMap(r=>r.updated.flatMap(x=>x.removed.map(f=>f.url))));
const changed=spawnSync('git',['diff','--name-only','-z','--','links'],{encoding:'utf8'}).stdout.split('\0').filter(Boolean);
let keptRemoved=0,deletedOriginalFriends=0,updated=0;
const errors=[];
for(const file of changed){
 const before=YAML.parse(spawnSync('git',['show','HEAD:'+file],{encoding:'utf8',maxBuffer:20*1024*1024}).stdout);
 if(!existsSync(file)){if(!deleted.has(file))errors.push({file,error:'unexpected deletion'});deletedOriginalFriends+=before.site.friends.length;continue;}
 const after=YAML.parse(readFileSync(file,'utf8'));
 const oldFriends=before.site.friends;const newFriends=after.site.friends;
 before.site.friends=[];after.site.friends=[];
 if(JSON.stringify(before)!==JSON.stringify(after))errors.push({file,error:'non-friends metadata changed'});
 let i=0;
 for(const f of oldFriends){if(i<newFriends.length&&JSON.stringify(f)===JSON.stringify(newFriends[i])){i++;continue;}
  keptRemoved++;if(!allowed.has(f.url))errors.push({file,error:'unplanned removed friend',url:f.url});
 }
 if(i!==newFriends.length)errors.push({file,error:'friend added/modified/reordered'});
 updated++;
}
if(errors.length)throw new Error(JSON.stringify(errors));
const result={changedYamlFiles:changed.length,deletedYamlFiles:deleted.size,updatedSurvivingYamlFiles:updated,removedReferencesFromSurvivingFiles:keptRemoved,originalReferencesInsideDeletedFiles:deletedOriginalFriends,totalRecordedReferencesRemoved:keptRemoved+deletedOriginalFriends,nonFriendMetadataChanges:0,addedOrModifiedFriends:0,errors:[]};
writeFileSync(root+'/semantic-verification.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
