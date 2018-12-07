import React, { Component } from 'react';
import './Sections.css';
import 'bootstrap/dist/css/bootstrap.min.css';




class HeaderSection extends Component{
    constructor(props) {
        super(props);
        this.children = props.children;
      }
    
      render() {
          let children = this.children ? this.children : "";
          return(
            <header className="bg-blue text-white auth-bg">
                <div className="container text-center">
                    {children}
                </div>
            </header>
          );
      }
}

class Section extends Component{
  constructor(props) {
      super(props);
      this.className = props.className;
  }
  render() {
      let className = this.className ? this.className : "bg-gray"; 
      return(
        <section className={className}>
          <div className="container text-justify">
            <div className="row">
              <div className="col-lg-8 mx-auto">
                {this.props.children}
              </div>
            </div>
          </div>
        </section>
      );
  }
}



export {Section, HeaderSection};