import React from 'react'

export class MirrorRepl extends React.Component {
  constructor(props) {
    super()
    this.code = props.code
  }
  componentDidMount() {
    const repl = CodeMirror.fromTextArea(this.el, {
      lineNumbers: true,
      mode: 'javascript',
      theme: 'nord',
      gutters: ['CodeMirror-lint-markers'],
      lint: {
        esversion: 6,
      },
    })
    repl.setValue(this.code)
    CodeMirror.on(repl, 'change', v => {
      //try {
      //  const x = eval(v.doc.getValue())
      //} catch (e) {
      //  console.log(e)
      //}
    })
  }

  componentWillUnmount() {
    //this.$el.somePlugin('destroy');
  }
  shouldComponentUpdate(nextProps, nextState) {
    return false
  }
  render() {
    return <textarea ref={el => (this.el = el)} />
  }
}
