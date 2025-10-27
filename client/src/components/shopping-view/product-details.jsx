import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { setProductDetails } from "@/store/shop/products-slice";
import { useToast } from "../ui/use-toast";
import StarRatingComponent from "../common/star-rating";
import "./ProductDetailsDialog.css";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);
  const { toast } = useToast();

  // Handle star rating change
  const handleRatingChange = (value) => {
    setRating(value);
  };

  // Add to cart
  const handleAddToCart = (productId, totalStock) => {
    const items = cartItems.items || [];
    const index = items.findIndex((item) => item.productId === productId);

    if (index > -1 && items[index].quantity + 1 > totalStock) {
      toast({
        title: `Only ${items[index].quantity} quantity can be added`,
        variant: "destructive",
      });
      return;
    }

    dispatch(addToCart({ userId: user?.id, productId, quantity: 1 })).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({ title: "Product added to cart" });
      }
    });
  };

  // Close dialog
  const handleDialogClose = () => {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
  };

  // Submit review
  const handleAddReview = async () => {
    if (!reviewMsg.trim() || rating === 0) {
      toast({ title: "Please provide rating and review", variant: "destructive" });
      return;
    }

    try {
      const result = await dispatch(
        addReview({
          productId: productDetails._id,
          userId: user?.id,
          userName: user?.userName,
          reviewMessage: reviewMsg,
          reviewValue: rating,
        })
      );

      if (result?.payload?.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails._id)); // refresh reviews
        toast({ title: "Review added successfully!" });
      } else {
        toast({ title: result?.payload?.message || "Failed to add review", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Something went wrong", variant: "destructive" });
    }
  };

  // Fetch reviews when product changes
  useEffect(() => {
    if (productDetails?._id) {
      dispatch(getReviews(productDetails._id));
    }
  }, [productDetails]);

  const averageReview =
    reviews && reviews.length
      ? reviews.reduce((sum, r) => sum + r.reviewValue, 0) / reviews.length
      : 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="product-dialog">
        <div className="image-container">
          <img src={productDetails?.image} alt={productDetails?.title} />
        </div>

        <div className="details">
          <h1>{productDetails?.title}</h1>
          <p className="description">{productDetails?.description}</p>

          <div className="price">
            <p className="original">${productDetails?.price}</p>
            {productDetails?.salePrice > 0 && <p className="sale">${productDetails?.salePrice}</p>}
          </div>

          {/* Average Rating */}
          <div className="rating">
            <StarRatingComponent rating={averageReview} readonly />
            <span>({averageReview.toFixed(2)})</span>
          </div>

          {/* Add to Cart */}
          <div className="add-to-cart">
            <Button
              onClick={() => handleAddToCart(productDetails?._id, productDetails?.totalStock)}
              disabled={productDetails?.totalStock === 0}
            >
              {productDetails?.totalStock === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
          </div>

          <div className="separator"></div>

          {/* Reviews */}
          <div className="reviews">
            {reviews && reviews.length ? (
              reviews.map((r) => (
                <div className="review-item" key={r._id}>
                  <div className="avatar">
                    <AvatarFallback>{r.userName[0].toUpperCase()}</AvatarFallback>
                  </div>
                  <div className="content">
                    <h3>{r.userName}</h3>
                    <div className="star-rating">
                      <StarRatingComponent rating={r.reviewValue} readonly />
                    </div>
                    <p>{r.reviewMessage}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No Reviews</p>
            )}

            {/* Review Form */}
            <div className="review-form">
              <Label>Write a review</Label>
              <div className="star-rating">
                <StarRatingComponent rating={rating} handleRatingChange={handleRatingChange} />
              </div>
              <Input
                value={reviewMsg}
                onChange={(e) => setReviewMsg(e.target.value)}
                placeholder="Write a review..."
              />
              <Button onClick={handleAddReview}>Submit</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
