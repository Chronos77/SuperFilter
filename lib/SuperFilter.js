(function ($) {
  $.fn.SuperFilter = function (options) {
    if (typeof options['filters'] !== 'object') {
      throw 'Filters is missing or not an Array'
    }

    $parentElement = $(this)
    $filters = []
    // Change all class to lowercase
    $parentElement.children().each(function () {
      $(this).attr('class', $(this).attr('class').toLowerCase())
    })

    // Add customize filters
    options['filters'].forEach((e) => {
      // Check if filter is an ID
      if (e[0] !== '#') {
        throw 'Filters is only with ID'
      }

      const filter = $(e)[0]
      const childrenByTag = {
        'ul': 'li',
        'select': 'option',
        'div': 'p'
      }
      const elementTag = filter.tagName.toLowerCase()
      const elementChild = childrenByTag[elementTag]

      $filters[$filters.length] = slugify($(filter).attr('id'))

      // Check if is a supported element
      if (elementChild === undefined) {
        throw `${filter.tagName.toLowerCase()} filter is not supported.`
      }

      // Search all children by element
      $(filter).find(elementChild).each(function () {
        let type = slugify($(filter).attr('id'))

        let attrName = $(this).attr('name').split(' ')

        if (typeof $(this).attr('id') === 'undefined') {
          $(this).attr('id', `filters_${type}_${tabNameToString(attrName)}`)
        }
        $(this).click(function () {
          // let hasActiveClass = $(this).hasClass('active')
          $(this).toggleClass('active')
          let firstSelect = selectFilterActive(type)
          let selector = []
          $filters.forEach(function (f) {
            if (f !== type) {
              let oSelector = selectFilterActive(f)
              oSelector.split(',').forEach(function (o) {
                firstSelect.split(',').forEach(function (i) {
                  selector[selector.length] = `${i}${o}`
                })
              })
            }
          })
          selector = selector.join(',')
          console.log(selector)
          $(`#${$parentElement.attr('id')} li`).show()
          if (selector !== '') {
            $(`#${$parentElement.attr('id')} li:not(${selector})`).hide()
          }
        })
      })
    })
    return this
  }

  function tabNameToString (array) {
    array.forEach((n, i) => {
      array[i] = slugify(n)
    })
    return array.join('_')
  }

  function selectFilterActive (type) {
    let $val = []
    $(`#${type} .active[id^="filters_"]`).each(function () {
      $val[$val.length] = `.${$(this).attr('name')}`.toLowerCase()
    })
    return $val.join(',')
  }

  function slugify (text) {
    return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
  }
}(jQuery))
