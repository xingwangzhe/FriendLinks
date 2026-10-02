/**
 * 确定性随机抽样工具
 * 使用固定种子随机打乱数组并取前 N 项，确保结果稳定
 * 所有端点共享同一批抽样结果，保证 dev 模式下使用一致的配置
 */

const SAMPLE_SEED = 42;

/**
 * 对数组进行确定性洗牌并取前 `size` 项
 * @param arr 输入数组
 * @param size 取样数量
 * @param seed 随机种子（默认 42）
 * @returns 截断后的数组
 */
export function deterministicSample<T>(arr: T[], size: number, seed = SAMPLE_SEED): T[] {
  if (arr.length <= size) return arr;
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = (seed * (i + 1)) % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, size);
}

/**
 * 判断当前是否为 DEV 模式
 */
export function isFastMode(): boolean {
  return import.meta.env?.DEV ?? false;
}

/**
 * 获取 Astro 配置注入的 DEV 抽样上限；0 表示不限量
 */
export function getDevSampleSize(): number {
  return __DEV_SAMPLE_SIZE__ === 0 ? Infinity : __DEV_SAMPLE_SIZE__;
}
