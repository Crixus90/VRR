console.log("this is fucking working");

const heart = "💗";

function like(event) {
  console.log(event);
  const postId = event.target.dataset.postid;

  // console.log
  // fetch is a function that allows us to do http calls
  fetch(`/likes/${postId}`, {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
    .then((res) => {
      return res.json();
    })
    .then((updatedPost) => {
      console.log(updatedPost);
      event.target.innerText = `${updatedPost.likes.length}${heart}`;
    });
}
