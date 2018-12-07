let trackList = document.getElementById("trackList");
trackList.onscroll = function(ev) {
  if (trackList.scrollTop === (trackList.scrollHeight - trackList.offsetHeight)) {
      alert("do fetch");
  }
};