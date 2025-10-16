import { useLazyLoad } from "../Hooks/LazyRendorHook";
import ProductCard from "../Shared/ProductCard/ProductCard";

const LazyProductCard = ({ item, handleAddWishlist }) => {
    const [ref, isVisible] = useLazyLoad();

    return (
        <div className="col-lg-4 col-sm-6 col-12" ref={ref}>
            {isVisible && (
                <ProductCard
                    mrp={item.MRP}
                    discount={item.DiscountPercent}
                    price={item.Price}
                    img={item.ProductThumbnail}
                    name={item.ProductName}
                    cartdata={item}
                    subCatName={item.SubCategoryName}
                    handleAddWishlist={handleAddWishlist}
                    rating={item.ProductRating}
                />
            )}
        </div>
    );
};

export default LazyProductCard;