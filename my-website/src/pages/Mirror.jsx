import React from 'react'

export class MirrorRepl extends React.Component {
  constructor(props) {
    super()
    this.code = props.code
    this.onCodeChange = props.onCodeChange
  }
  componentDidMount() {
    const repl = CodeMirror.fromTextArea(this.el, {
      lineNumbers: true,
      mode: 'javascript',
      theme: 'nord',
      //gutters: ['CodeMirror-lint-markers'],
      //lint: {
      //  esversion: 6,
      //},
    })
    this.code && repl.setValue(this.code)
    this.onCodeChange && CodeMirror.on(repl, 'change', ()=>{
      this.onCodeChange(repl.getValue())
    })
    this.repls = repl
  }

  componentWillUnmount() {
    //this.$el.somePlugin('destroy');
  }
  shouldComponentUpdate(nextProps, nextState) {

    if (nextProps.code !== this.code) {
      this.code = nextProps.code
      this.repls.setValue(this.code)
    }
    return false
  }
  render() {
    return<textarea ref={el => (this.el = el)} />
  }
}
