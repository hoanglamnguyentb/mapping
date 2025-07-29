import { AddressMapping } from '@/types/address';

export function convertAddress(input: string, mapping: AddressMapping): string {
  let result = input;

  for (const [newLevel1, config] of Object.entries(mapping)) {
    // Kiểm tra xem input có chứa alias tỉnh/thành (không phân biệt hoa thường)
    const matched = config.level1_aliases.some((alias) =>
      result.toLowerCase().includes(alias.toLowerCase())
    );
    if (!matched) continue;

    // Thay level2 (xã/phường) - ưu tiên chuỗi dài hơn trước
    const sortedLevel2 = Object.keys(config.level2s).sort(
      (a, b) => b.length - a.length
    );
    for (const old of sortedLevel2) {
      const regex = new RegExp(old, 'gi');
      result = result.replace(regex, config.level2s[old]);
    }

    // Thay level1 (tỉnh/thành)
    for (const alias of config.level1_aliases) {
      const regex = new RegExp(alias, 'gi');
      result = result.replace(regex, newLevel1);
    }
  }

  return result;
}

export function removeDistrictParts(address: string): string {
  const parts = address.split(/\s*[-,_]\s*/).map((p) => p.trim());
  console.log('Part', parts);
  const removeKeywords = ['quận', 'huyện', 'thị xã', 'thành phố trực thuộc'];

  // Tìm tất cả phần có "thành phố" (không phân biệt hoa thường)
  const cityParts = parts.filter((p) =>
    p.toLowerCase().startsWith('thành phố')
  );
  let removedFirstCity = false;

  const result = parts.filter((part) => {
    const lower = part.toLowerCase();

    // Bỏ các phần bắt đầu bằng Quận, Huyện, ...
    if (removeKeywords.some((kw) => lower.startsWith(kw))) {
      return false;
    }

    // Bỏ thành phố đầu tiên nếu có nhiều hơn 1 phần bắt đầu bằng "Thành phố"
    if (lower.startsWith('thành phố')) {
      if (cityParts.length > 1 && !removedFirstCity) {
        removedFirstCity = true;
        return false;
      }
    }

    return true;
  });

  return result.join(', ');
}
