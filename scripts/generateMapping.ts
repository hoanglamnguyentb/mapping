// scripts/generateMapping.ts
import fs from 'fs';
import raw from './merges.json';

type FinalMapping = Record<
  string,
  {
    level1_aliases: string[];
    level2s: Record<string, string>;
  }
>;

const result: FinalMapping = {};

for (const level1 of raw.data) {
  const level1Name = level1.name;

  // Khởi tạo object nếu chưa có
  if (!result[level1Name]) {
    result[level1Name] = {
      level1_aliases: [],
      level2s: {},
    };
  }

  // Thêm các tỉnh/thành cũ bị sáp nhập vào đây
  for (const merge of level1.merges || []) {
    if (!result[level1Name].level1_aliases.includes(merge.name)) {
      result[level1Name].level1_aliases.push(merge.name);
    }
  }

  // Mapping các xã/phường/quận cũ → mới
  for (const level2 of level1.level2s || []) {
    for (const merge of level2.merges || []) {
      result[level1Name].level2s[merge.name] = level2.name;
    }
  }
}

// Ghi ra file
fs.writeFileSync('./public/mapping.json', JSON.stringify(result, null, 2));
console.log('✅ mapping.json generated!');
