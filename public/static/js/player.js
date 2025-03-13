(function () {
  "use strict";

  var $media;
  var mediaError = err => {
    $.dialog({
      icon: "bi bi-exclamation-circle-fill text-danger",
      closeIcon: false,
      title: "Media Stream Error",
      content: err.message
    });
  };

  var splashClose = cb => {
    if (typeof cb !== "function") cb = null;
    $(splash).is(":visible") ? $(splash).fadeOut(cb) : cb && cb();
  };

  $(document).on("DOMContentLoaded", () => {
    $media = $(media);
    media.src = $media.data("src");

    $media.on("error", () => {
      splashClose(() => mediaError(media.error));
      console.error(media.error);
    });

    $media.on("loadeddata", () => splashClose());
    $media.on("contextmenu", () => false);
    $media.removeAttr("data-src");
  });
})();
