import { setListing } from "../redux/listingslice.jsx";
async function viewUserListings(userid, dispatch) {
  try {
    const response = await fetch(`/api/getlist/${userid}`);

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    dispatch(setListing(data.userlistings));
  } catch (err) {
    console.log(err.message);
    return [];
  }
}
export default viewUserListings;
