import React from 'react'
//if (!window.JSHINT) {
//  if (window.console) {
//    window.console.error("Error: window.JSHINT not defined, CodeMirror JavaScript linting cannot run.");
//  }
//  return [];
//}
//if (!options.indent) // JSHint error.character actually is a column index, this fixes underlining on lines using tabs for indentation
//  options.indent = 1; // JSHint default value is 4
//JSHINT(text, options, options.globals);
//var errors = JSHINT.data().errors, result = [];
//if (errors) parseErrors(errors, result);
//return result;
//}
//
//CodeMirror.registerHelper("lint", "javascript", validator);
//
//function parseErrors(errors, output) {
//  for ( var i = 0; i < errors.length; i++) {
//    var error = errors[i];
//    if (error) {
//      if (error.line <= 0) {
//        if (window.console) {
//          window.console.warn("Cannot display JSHint error (invalid line " + error.line + ")", error);
//        }
//        continue;
//      }
//
//      var start = error.character - 1, end = start + 1;
//      if (error.evidence) {
//        var index = error.evidence.substring(start).search(/.\b/);
//        if (index > -1) {
//          end += index;
//        }
//      }
//
//      // Convert to format expected by validation service
//      var hint = {
//        message: error.reason,
//        severity: error.code ? (error.code.startsWith('W') ? "warning" : "error") : "error",
//        from: CodeMirror.Pos(error.line - 1, start),
//        to: CodeMirror.Pos(error.line - 1, end)
//      };
//
//      output.push(hint);
//    }
//  }
//}

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
