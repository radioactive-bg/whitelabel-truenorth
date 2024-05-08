import create from 'zustand';
type Product = {
    // define the properties of a product
};

type ProductsState = {
    products: Product[];
};

const useProductsStore = create<ProductsState>((set) => ({
    products: [],
}));

export default useProductsStore;
