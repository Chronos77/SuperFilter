(function ($) {
  $.fn.SuperFilter = function (options) {
    if (typeof options['filters'] !== 'object') {
      throw 'Filters is missing or not an Array'
    }

    $elementContainerTags = $(`${options['containerTags']}`)
    $tagList = $('<ul></ul>')
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
          $($tagList).empty()
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
          $(`#${$parentElement.attr('id')} li`).show()
          if (selector !== '') {
            $(`#${$parentElement.attr('id')} li:not(${selector})`).hide()
          }
        })
      })
    })

    if (typeof options['containerTags'] !== 'undefined') {
      if (options['containerTags'][0] === '#') {

        if (window.location.search.length > 0) {
          let parametersString = window.location.search.replace('?', '')
          let parametersArray = parametersString.split('&')
          parametersArray.forEach(function (params) {
            let [ key, values ] = params.split('=')
            values.split(',').forEach(function (value) {
              $($tagList).append(`<li>${value}</li>`)
              $(`#filters_${key.toLowerCase()}_${value.toLowerCase()}`).click()
            })
          })
        }
        $elementContainerTags.append($tagList)
      }
      else {
        throw 'containerTags is not an ID'
      }
    }

    return this;
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
      let name = $(this).attr('name').toLowerCase()
      $val[$val.length] = `.${name}`
      $($tagList).append(`<li>${name}</li>`)
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
