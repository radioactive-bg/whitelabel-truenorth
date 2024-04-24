//must write our definitions later in this file
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  User,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';

const API_URL = process.env.REACT_APP_API_URL;
const ITEMS_PER_PAGE = 6;

export async function fetchLatestInvoices() {
  try {
    const response = await fetch(`${API_URL}/latest-invoices`, {
      method: 'GET',
    });
    if (!response.ok) throw new Error('Failed to fetch the latest invoices.');
    const data = await response.json();
    // must set a type later
    return data.map((invoice: any) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
  } catch (error) {
    console.error('Fetch Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const response = await fetch(
      `${API_URL}/invoices?query=${encodeURIComponent(query)}&offset=${offset}`,
      { method: 'GET' },
    );
    if (!response.ok) throw new Error('Failed to fetch invoices.');
    const invoices = await response.json();
    return invoices;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const response = await fetch(
      `${API_URL}/invoices/pages?query=${encodeURIComponent(query)}`,
      { method: 'GET' },
    );
    if (!response.ok)
      throw new Error('Failed to fetch total number of invoices pages.');
    const data = await response.json();
    const totalPages = Math.ceil(Number(data.totalCount) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const response = await fetch(`${API_URL}/invoice/${id}`, { method: 'GET' });
    if (!response.ok) throw new Error('Failed to fetch invoice.');
    const invoice = await response.json();
    return invoice;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function getUser(email: string) {
  try {
    const response = await fetch(
      `${API_URL}/user?email=${encodeURIComponent(email)}`,
      { method: 'GET' },
    );
    if (!response.ok) throw new Error('Failed to fetch user.');
    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw new Error('Failed to fetch user.');
  }
}
