(function ($) { 

  $.fn.SuperFilter = function (options) {
    if (typeof options['filters'] !== 'object') {
      throw 'Filters is missing or not an Array'
    }

    $parentElement = $(this)
    // Change all class to lowercase
    $parentElement.children().each(function () {
      $(this).attr('class', $(this).attr('class').toLowerCase())
    })

    // Add customize filters
    options['filters'].forEach((e) => {
      // Check if filter is an ID
      if (e[0] !== "#") {
        throw 'Filters is only an ID'
      }

      const list = $(this)
      const filter = $(e)[0]
      const childrenByTag = {
        "ul" : "li",
        "select": "option",
        "div": "p"
      }
      const elementTag = filter.tagName.toLowerCase()
      const elementChild = childrenByTag[elementTag] 

      // Check if is a supported element
      if (elementChild === undefined) {
        throw `${ filter.tagName.toLowerCase() } filter is not supported.`
      }

      // Search all children by element
      $(filter).find(elementChild).each(function () {  
        let type = slugify($(filter).attr('id'))
        let val = slugify($(this).text())
        if (typeof $(this).attr('id') === 'undefined') {
          $(this).attr('id', `filters_${type}_${val}`)
        }
        $(this).click(function () {
          let hasActiveClass = $(this).hasClass('active')
          $(`${elementTag} ${elementChild}[id^="filters_${type}_"]`).removeClass('active')
          if (!hasActiveClass) {
            $(this).addClass('active')
          }
          let selector = selectFilterActive()
          $(`#${$parentElement.attr('id')} li`).show()
          if (selector !== '') {
            $(`#${$parentElement.attr('id')} li:not(${selector})`).hide()
          }
        })
      })
    })
    return this;
  };

  function selectFilterActive() {
    let val = ''
    $(`.active[id^="filters_"]`).each(function () {
      val += `.${ $(this).text() }`
    })
    return val.toLowerCase()
  }

  function slugify(text) {
    return text.toString().toLowerCase()
                          .replace(/\s+/g, '-')
                          .replace(/[^\w\-]+/g, '')
                          .replace(/\-\-+/g, '-')
                          .replace(/^-+/, '')
                          .replace(/-+$/, '')
  }

}(jQuery));