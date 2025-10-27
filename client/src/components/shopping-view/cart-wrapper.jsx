import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();

  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  return (
    <SheetContent
      className="sm:max-w-md bg-white border border-gray-200 shadow-xl text-gray-900"
      style={{
        backdropFilter: "none",
        backgroundColor: "#fff",
      }}
    >
      <SheetHeader className="border-b border-gray-200 pb-3">
        <SheetTitle className="text-xl font-semibold text-black">
          Your Cart
        </SheetTitle>
      </SheetHeader>

      <div className="mt-6 space-y-4 overflow-y-auto max-h-[60vh] pr-2">
        {cartItems && cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <UserCartItemsContent key={index} cartItem={item} />
          ))
        ) : (
          <p className="text-gray-500 text-center py-6">Your cart is empty</p>
        )}
      </div>

      <div className="mt-6 border-t border-gray-200 pt-4">
        <div className="flex justify-between text-lg font-medium">
          <span>Total</span>
          <span>${totalCartAmount.toFixed(2)}</span>
        </div>
      </div>

      <Button
        onClick={() => {
          navigate("/shop/checkout");
          setOpenCartSheet(false);
        }}
        className="w-full mt-6 bg-black hover:bg-gray-900 text-white font-semibold rounded-md py-2"
      >
        Checkout
      </Button>
    </SheetContent>
  );
}

export default UserCartWrapper;
