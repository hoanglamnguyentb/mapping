// scripts/generateMapping.ts
import fs from 'fs';

import raw from './merges.json'; // dữ liệu JSON bạn đưa ban đầu
const result: Record<string, string> = {};

// 1. Xử lý merges ở cấp level1 (Tỉnh/Thành phố)
for (const level1 of raw.data) {
  for (const merge of level1.merges || []) {
    result[merge.name] = level1.name;
  }

  // 2. Xử lý merges ở cấp level2 (Quận/Huyện/Phường/Xã)
  for (const level2 of level1.level2s || []) {
    for (const merge of level2.merges || []) {
      result[merge.name] = level2.name;
    }
  }
}

fs.writeFileSync('./public/mapping.json', JSON.stringify(result, null, 2));
