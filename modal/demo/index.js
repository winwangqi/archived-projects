!function () {
  var modal = new Modal({
    title: 'title',
    animation: {
      enter: 'fadeInDown',
      leave: 'fadeOutUp'
    },
    maskClosable: true,
    confirmText: 'yes',
    cancelText: 'no'
  })
  
  modal.on('confirm', function () {
    console.log("confirm")
  })

  modal.on('cancel', function () {
    console.log("cancel")
  })

  document.querySelector('#modal-btn').addEventListener('click', function () {
    modal.show('这里是一些内容')
  })
}()