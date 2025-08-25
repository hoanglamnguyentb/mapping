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
  // 1. Chọn ký tự phân tách xuất hiện nhiều nhất
  const separators = ['-', ',', '_'];
  const counts = separators.map((sep) => ({
    sep,
    count: address.split(sep).length - 1,
  }));
  const maxCount = Math.max(...counts.map((c) => c.count));
  const mainSep = counts.find((c) => c.count === maxCount)?.sep || '-';

  // 2. Split địa chỉ theo dấu chính
  const parts = address
    .split(new RegExp(`\\s*${mainSep}\\s*`))
    .map((p) => p.trim());

  // 3. Xác định các phần cần loại bỏ
  const removeKeywords = ['quận', 'huyện', 'thị xã', 'thành phố trực thuộc'];

  // Tìm tất cả phần bắt đầu bằng "thành phố" (không phân biệt hoa thường)
  const cityParts = parts.filter((p) =>
    p.toLowerCase().startsWith('thành phố')
  );

  let removedFirstCity = false;

  // 4. Lọc các phần theo điều kiện
  const result = parts.filter((part) => {
    const lower = part.toLowerCase();

    // Loại bỏ các phần bắt đầu bằng từ khóa
    if (removeKeywords.some((kw) => lower.startsWith(kw))) {
      return false;
    }

    // Loại bỏ "thành phố" đầu tiên nếu có nhiều hơn 1 phần
    if (lower.startsWith('thành phố')) {
      if (cityParts.length > 1 && !removedFirstCity) {
        removedFirstCity = true;
        return false;
      }
    }

    return true;
  });

  // 5. Join lại các phần còn lại
  return result.join(', ');
}
