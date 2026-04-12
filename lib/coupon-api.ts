export interface CouponData {
  description: string;
  id: string;
}

export async function validateCoupon(code: string): Promise<CouponData> {
  const res = await fetch(
    `/api/coupon?code=${encodeURIComponent(code)}`,
  );
  const data: CouponData & { error?: string } = await res.json();
  if (data.error) throw new Error(data.error);
  return { description: data.description, id: data.id };
}
