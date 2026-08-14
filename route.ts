import { desc, inArray, sql } from "drizzle-orm";
import { getDb } from "../../../db";
import { customers, expenses, partners, products, saleItems, sales, suppliers } from "../../../db/schema";

export const dynamic = "force-dynamic";

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "No fue posible completar la operación.";
}

export async function GET() {
  try {
    const db = getDb();
    const productRows = await db.select().from(products).orderBy(products.name);
    const customerRows = await db.select().from(customers).orderBy(desc(customers.totalSpent)).limit(100);
    const saleRows = await db.select().from(sales).orderBy(desc(sales.id)).limit(30);
    const supplierRows = await db.select().from(suppliers).orderBy(suppliers.name);
    const partnerRows = await db.select().from(partners).orderBy(desc(partners.id));
    const expenseRows = await db.select().from(expenses).orderBy(desc(expenses.id)).limit(30);
    return Response.json({ products: productRows, customers: customerRows, sales: saleRows, suppliers: supplierRows, partners: partnerRows, expenses: expenseRows });
  } catch (error) {
    return Response.json({ error: errorMessage(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json() as Record<string, unknown>;
    const action = String(payload.action ?? "");
    const db = getDb();

    if (action === "product") {
      const name = String(payload.name ?? "").trim();
      const brand = String(payload.brand ?? "").trim();
      const sku = String(payload.sku ?? "").trim().toUpperCase();
      if (!name || !brand || !sku) return Response.json({ error: "Nombre, marca y SKU son obligatorios." }, { status: 400 });
      const [product] = await db.insert(products).values({
        name, brand, sku, family: String(payload.family ?? "Floral"), sizeMl: Number(payload.sizeMl ?? 100),
        price: Number(payload.price ?? 0), cost: Number(payload.cost ?? 0), stock: Number(payload.stock ?? 0), minStock: Number(payload.minStock ?? 5),
      }).returning();
      return Response.json({ product }, { status: 201 });
    }

    if (action === "customer") {
      const name = String(payload.name ?? "").trim();
      if (!name) return Response.json({ error: "El nombre del cliente es obligatorio." }, { status: 400 });
      const [customer] = await db.insert(customers).values({ name, phone: String(payload.phone ?? ""), email: String(payload.email ?? ""), tier: String(payload.tier ?? "Rosa"), points: Number(payload.points ?? 0) }).returning();
      return Response.json({ customer }, { status: 201 });
    }

    if (action === "supplier") {
      const name = String(payload.name ?? "").trim();
      if (!name) return Response.json({ error: "El proveedor necesita un nombre." }, { status: 400 });
      const [supplier] = await db.insert(suppliers).values({ name, contact: String(payload.contact ?? ""), phone: String(payload.phone ?? ""), brands: String(payload.brands ?? ""), leadDays: Number(payload.leadDays ?? 7) }).returning();
      return Response.json({ supplier }, { status: 201 });
    }

    if (action === "partner") {
      const name = String(payload.name ?? "").trim();
      const referralCode = String(payload.referralCode ?? "").trim().toUpperCase();
      if (!name || !referralCode) return Response.json({ error: "El nombre y el código de referencia son obligatorios." }, { status: 400 });
      const [partner] = await db.insert(partners).values({ name, referralCode, phone: String(payload.phone ?? ""), email: String(payload.email ?? ""), benefit: String(payload.benefit ?? "15% en compras") }).returning();
      return Response.json({ partner }, { status: 201 });
    }

    if (action === "expense") {
      const concept = String(payload.concept ?? "").trim();
      const amount = Number(payload.amount ?? 0);
      if (!concept || amount <= 0) return Response.json({ error: "Indica el concepto y un monto válido." }, { status: 400 });
      const [expense] = await db.insert(expenses).values({ concept, amount, category: String(payload.category ?? "Operación"), paymentMethod: String(payload.paymentMethod ?? "Transferencia") }).returning();
      return Response.json({ expense }, { status: 201 });
    }

    if (action === "sale") {
      const rawItems = Array.isArray(payload.items) ? payload.items as Array<{ productId?: number; quantity?: number }> : [];
      if (!rawItems.length) return Response.json({ error: "Añade al menos un perfume a la venta." }, { status: 400 });
      const ids = [...new Set(rawItems.map((item) => Number(item.productId)).filter(Boolean))];
      const productRows = await db.select().from(products).where(inArray(products.id, ids));
      const normalized = rawItems.map((item) => {
        const product = productRows.find((row) => row.id === Number(item.productId));
        const quantity = Math.max(1, Number(item.quantity ?? 1));
        if (!product || product.stock < quantity) throw new Error("Uno de los productos ya no tiene stock suficiente.");
        return { product, quantity, total: product.price * quantity };
      });
      const subtotal = normalized.reduce((sum, item) => sum + item.total, 0);
      const discount = Math.min(subtotal, Math.max(0, Number(payload.discount ?? 0)));
      const total = subtotal - discount;
      const operator = String(payload.operator ?? "Equipo Cherosa");
      const [sale] = await db.insert(sales).values({ customerId: payload.customerId ? Number(payload.customerId) : null, customerName: String(payload.customerName ?? "Cliente ocasional"), subtotal, discount, total, paymentMethod: String(payload.paymentMethod ?? "Efectivo"), itemCount: normalized.reduce((sum, item) => sum + item.quantity, 0), operator }).returning();
      await db.insert(saleItems).values(normalized.map((item) => ({ saleId: sale.id, productId: item.product.id, productName: item.product.name, quantity: item.quantity, unitPrice: item.product.price, total: item.total })));
      for (const item of normalized) await db.update(products).set({ stock: sql`${products.stock} - ${item.quantity}` }).where(inArray(products.id, [item.product.id]));
      return Response.json({ sale }, { status: 201 });
    }

    return Response.json({ error: "Acción no válida." }, { status: 400 });
  } catch (error) {
    return Response.json({ error: errorMessage(error) }, { status: 500 });
  }
}
