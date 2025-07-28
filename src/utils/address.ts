import { AddressMapping } from '@/types/address';

export function convertAddress(input: string, mapping: AddressMapping): string {
  let result = input;

  for (const [newLevel1, config] of Object.entries(mapping)) {
    // Nếu địa chỉ có chứa tên tỉnh/thành cũ (alias) thì mới áp dụng
    const matched = config.level1_aliases.some((alias) =>
      input.includes(alias)
    );
    if (!matched) continue;

    // Áp dụng mapping cấp xã/phường cho đúng tỉnh/thành
    const sortedLevel2 = Object.keys(config.level2s).sort(
      (a, b) => b.length - a.length
    );
    for (const old of sortedLevel2) {
      if (result.includes(old)) {
        result = result.replace(old, config.level2s[old]);
      }
    }

    // Thay tên tỉnh/thành nếu có
    for (const alias of config.level1_aliases) {
      if (result.includes(alias)) {
        result = result.replace(alias, newLevel1);
      }
    }
  }

  return result;
}

export function removeDistrictParts(address: string): string {
  const parts = address.split(',').map((p) => p.trim());
  const removeKeywords = ['Quận', 'Huyện', 'Thị xã', 'Thành phố trực thuộc'];
  let seenFirstCity = false;

  const result = parts.filter((part) => {
    // Bỏ các phần bắt đầu bằng Quận, Huyện, ...
    if (removeKeywords.some((kw) => part.startsWith(kw))) {
      return false;
    }

    // Với "Thành phố ..."
    if (part.startsWith('Thành phố')) {
      if (!seenFirstCity) {
        seenFirstCity = true;
        return false; // Bỏ thành phố đầu tiên
      }
    }

    return true;
  });

  return result.join(', ');
}
