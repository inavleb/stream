(function () {
  "use strict";

  $(document).on("DOMContentLoaded", () => {
    $('[data-name="play"]').click(function (evt) {
      evt.preventDefault();

      var player = $($('[data-template="player"]').html());
      var iframe = player.find("iframe").get(0);

      $(iframe).one("load", () => {
        $('[data-name="iframe-loading"]').fadeOut();
      });

      iframe.src = this.href;

      player.appendTo(document.body);
    });
  });
})();
