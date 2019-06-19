import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ___ from 'lodash';
import './App.css';

import {fadeIn} from 'react-animations';
import styled, {keyframes} from 'styled-components';

const Bounce = styled.div`animation: 3s ${keyframes `${fadeIn}`} linear infinite`;

//https://codesandbox.io/s/powster-coding-test-nvc50
// GOAL: Create a React Gallery App with 1 large active image, and inactive thumb images below where you can change the active image
// INSTRUCTIONS:
// 0. Fork this repo to a new project
// 1. Make a call to the giphy API and pull in a list of random images (API url: https://api.giphy.com/v1/gifs/trending?api_key=PEyIrGaWdf08Lw4nezyXejpD9Y0pO6Rt)
// 1.1 You can read up on the api over here https://developers.giphy.com/docs/

// 2. Set the active image in the state of the Gallery component //activeImage
// 3. Create a list of inactive images using the GalleryThumb Component //hideImageList
// 4. Add an automatic timer that changes the active images after 3 seconds
// 5. On click of each GalleryThumb, update the active image //newActive
// 6. Add a remove button on the GalleryThumb that deletes images when clicked //hideImage
// 7. Add a slick animation to transition between active images (that's more complex then just opacity)
// 8. Add any extra styling & behaviour to make it look polished 

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {images: [], activeImage:"", hideImageList: [], transition:false};

    this.newActive = this.newActive.bind(this);
    this.hideImage = this.hideImage.bind(this);
  }

  componentDidMount() {
    this.imageList();
  }

  async imageList() {
    let url = 'http://api.giphy.com/v1/gifs/'
    //if search then 
    //url += 'search?'
    //url += 'q=funny+cat'
    //default trending so 
    url += 'trending?api_key=PEyIrGaWdf08Lw4nezyXejpD9Y0pO6Rt';
    try {
      let response = await fetch(url)
      //.clone() because 'body stream is locked'
      let data = await response.clone().json();
      console.log(data, 'data');
      this.setState({
        images: data.data, 
        activeImage:data.data[0].images['downsized_medium'].url
      });
    }
    catch (err){
      console.log(err, 'error')
    }
  }

  newActive(image, transition){
    this.setState({
      transition:transition,
      activeImage:image
    });
  }

  hideImage(e){
    const { hideImageList } = this.state;
    if (hideImageList.indexOf(e.target.id) === -1) {
      hideImageList.push(e.target.id);
    }
    this.setState(hideImageList);
  }

  render() {

    const { images, activeImage,hideImageList, transition } = this.state;
    return (
      <div>
        <div className="container">
          <div style={{height:'300px'}}> 
            <div style={{
              marginTop: '4%',
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '6%',
            }}>

              {transition && <Bounce><img style={{maxHeight:'288px'}} src={activeImage} alt='active' /></Bounce>}
              {!transition && <img style={{maxHeight:'288px'}} src={activeImage} alt='active' />}
            </div>
          </div>
          <hr></hr>
          <GalleryThumb images={images} hideImageList={hideImageList} activeImage={activeImage} newActive={this.newActive} hideImage={this.hideImage}/>
          <hr></hr>
        </div>
      </div>
    )
  }
}


class GalleryThumb extends Component {
  static get propTypes() {
    return {
      images: PropTypes.array.isRequired,
      hideImageList: PropTypes.array.isRequired,
      activeImage: PropTypes.string.isRequired,
      newActive: PropTypes.func.isRequired,
      hideImage: PropTypes.func.isRequired,
    };
  }

  constructor(props) {
    super(props);
    this.state = {arrow: 0};
  }

  componentDidUpdate(prevProps) {
    if (prevProps.images.length < this.props.images.length){
      this.nextImage();
    }
  }

  makeActive(e){
    this.props.newActive(e.target.src, true);
  }

  removeImage(e){
    this.props.hideImage(e);
  }

  nextImage(){
    //4. Add an automatic timer that changes the active images after 3 seconds
    let arrayI = this.props.images;
    let num = 0;
    setInterval(function(){
        this.props.newActive(arrayI[num++ % arrayI.length].images['downsized_medium'].url, false);
    }.bind(this), 3000)
  }

  clickArrow(direction){
    let { arrow } = this.state;

    if (direction === 'left'){
      if (arrow > 0){
        arrow -= 1
      }
    }
    if (direction === 'right'){
      //decided 6 image per carousel
      if (arrow < Math.floor(this.props.images.length/ 6)){
        arrow += 1
      }
    }
    this.setState({arrow:arrow});
  }

  render() {
    let { arrow } = this.state;
    //the active image shouldn't be in the gallery
    //console.log(this.props.hideImageList, 'hideImageList')
    let count = 0;
    const images1 = ___.map(this.props.images, (image) => {
      if (image.images['downsized_medium'].url !== this.props.activeImage &&
        this.props.hideImageList.indexOf(image.images['downsized_medium'].url) < 0){
        
        count +=1
        if ( count > 0+(arrow*6) && count < 7+(arrow*6)){
          return (
            <div key={image.id} style={{float: 'left', width:'10%', marginLeft:'1%', marginRight: '1%', overflow: 'hidden'}}>
              <div className='xButton' style={{display: 'flex', justifyContent: 'center'}}>
                <img style={{maxHeight:'72px'}} src={image.images['downsized_medium'].url} alt='active' onClick={(e) => this.makeActive(e)}/>
                <button className="close" id={image.images['downsized_medium'].url} onClick={(e) => this.removeImage(e)} >X</button>
              </div>
            </div>
          );
        }
      }
    });

    const leftArrowURL = 'https://image.flaticon.com/icons/svg/467/467272.svg'
    let leftArrow = (
      <div style={{float: 'left', width:'10%', marginLeft:'1%', marginRight: '1%', overflow: 'hidden'}}>
        {arrow !== 0 && 
          <img style={{maxHeight:'72px'}} src={leftArrowURL} alt='active' onClick={(e) => this.clickArrow('left')}/>}
        {arrow === 0 && 
          <div>&nbsp;</div>}
      </div>)
    

    const rightArrowURL = 'https://image.flaticon.com/icons/svg/467/467280.svg'
    let rightArrow = (
        <div style={{float: 'left', width:'10%', marginLeft:'1%', marginRight: '1%', overflow: 'hidden'}}>
          { arrow < (Math.floor(this.props.images.length) / 6) -2 && 
            <img style={{maxHeight:'72px'}} src={rightArrowURL} alt='active' onClick={(e) => this.clickArrow('right')}/>}
          { arrow > (Math.floor(this.props.images.length) / 6) -2&& 
            <div>&nbsp;</div>}
      </div>)
    

    return (
      <div>
        <div className="container" style={{
            overflow:'hidden',
            marginLeft: '4%',
            marginRight: '4%',}}>

            {leftArrow}
              {images1}
            {rightArrow}
        </div>
      </div>
    )
  }
}


export default App;
