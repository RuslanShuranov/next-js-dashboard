import { formatCurrency } from './utils';
import prisma from '@/lib/prisma';

export async function fetchRevenue() {
  try {
    await new Promise(resolve => setTimeout(resolve, 3000));

    return await prisma.revenue.findMany();
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await prisma.invoices.findMany({
      orderBy: {
        date: 'desc',
      },
      include: {
        customer: true,
      },
      take: 5,
    });

    return data.map(invoice => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  try {
    const invoiceCountPromise = prisma.invoices.count();
    const customerCountPromise = prisma.customers.count();
    const invoiceStatusPromise = prisma.invoices.groupBy({
      by: ['status'],
      _sum: {
        amount: true,
      },
    });

    const [invoiceCount, customerCount, invoiceStatus] = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(invoiceCount ?? '0');
    const numberOfCustomers = Number(customerCount ?? '0');
    const totalPaidInvoices =
      invoiceStatus.find(status => status.status === 'paid')?._sum.amount ?? 0;
    const totalPendingInvoices =
      invoiceStatus.find(status => status.status === 'pending')?._sum.amount ?? 0;

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(query: string, currentPage: number) {
  try {
    return await prisma.invoices.findMany({
      where: {
        OR: [
          {
            customer: {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
          {
            customer: {
              email: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
          {
            amount: {
              equals: isNaN(Number(query)) ? undefined : Number(query),
            },
          },
          {
            date: {
              gte: isNaN(Date.parse(query)) ? undefined : new Date(query),
            },
          },
          {
            status: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
        customer: true,
      },
      orderBy: {
        date: 'desc',
      },
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const count = await prisma.invoices.count({
      where: {
        OR: [
          {
            customer: {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
          {
            customer: {
              email: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
          {
            amount: {
              equals: isNaN(Number(query)) ? undefined : Number(query),
            },
          },
          {
            date: {
              gte: isNaN(Date.parse(query)) ? undefined : new Date(query),
            },
          },
          {
            status: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
    });

    return Math.ceil(count / ITEMS_PER_PAGE);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const invoice = await prisma.invoices.findUnique({
      where: {
        id,
      },
      include: {
        customer: true,
      },
    });

    if (!invoice) {
      return null;
    }

    invoice.amount = invoice.amount / 100;
    return invoice;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    return await prisma.customers.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const customersWithInvoices = await prisma.customers.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        invoices: {
          select: {
            status: true,
            amount: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return customersWithInvoices.map(customer => {
      const total_invoices = customer.invoices.length;

      let total_pending = 0;
      let total_paid = 0;

      for (const invoice of customer.invoices) {
        if (invoice.status === 'pending') {
          total_pending += invoice.amount;
        } else if (invoice.status === 'paid') {
          total_paid += invoice.amount;
        }
      }

      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        image_url: customer.image_url,
        total_invoices,
        total_pending, // This is a number, as per CustomersTableType
        total_paid, // This is also a number
      };
    });
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}
