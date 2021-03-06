import React, { Component } from 'react';
import BucketListItemModalForm from './bucketlist-item-modal.jsx';
import request from 'superagent';
import {
    Col,
    form,
    Form,
    FormGroup,
    FormControl,
    Control,
    ControlLabel,
    Checkbox,
    Button,
    Tab,
    Tabs,
    ButtonToolbar,
    OverlayTrigger,
    Overlay,
    Popover
} from 'react-bootstrap';

export default class BucketListItem extends Component {
    constructor() {
        super();
        this.deleteBucketlistItem = this.deleteBucketlistItem.bind(this);
        this.displayBucketlistItems = this.displayBucketlistItems.bind(this);
        this.displaySingleBucketlistItem = this.displaySingleBucketlistItem.bind(this);
        this.displayBucketlistItemsTitle = this.displayBucketlistItemsTitle.bind(this);
        this.handleEditBucketlistItem = this.handleEditBucketlistItem.bind(this);
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleUpdateBucketlistItem = this.handleUpdateBucketlistItem.bind(this);
        this.hideDeletePopover = this.hideDeletePopover.bind(this);
        this.updateBucketlistItem = this.updateBucketlistItem.bind(this);
        this.showEditBucketlistItemForm = this.showEditBucketlistItemForm.bind(this);
        this.hideEditBucketlistItemForm = this.hideEditBucketlistItemForm.bind(this);
        //this.displayAllBucketlistItems = this.displayAllBucketlistItems.bind(this);
        this.state = {
          items: [],
          bucketlistId: 0,
          itemId: 0,
          itemName: '',
          showDeletePopover: false
        }
    }
    handleFieldChange(event) {
      event.preventDefault();
      let key = event.target.name;
      let value = event.target.value;
      this.setState({
          [key]: value
      });
    }

    displayBucketlistItems(bucketlistId, items) {
      if (!(bucketlistId === 0 || bucketlistId === '' || bucketlistId === undefined)) {
        if (items.length > 0) {
          return (
            items.map((item) => {
              return (
                this.displaySingleBucketlistItem(bucketlistId, item)
              );
          })
          );
        }
        else {
          return (
            <div>
              No items yet.
            </div>
        );
        };
      }
    }

  handleEditBucketlistItem(bucketlistId, itemId, itemName) {
    this.setState({
      bucketlistId: bucketlistId,
      itemId: itemId,
      itemName: itemName
    });
    this.showEditBucketlistItemForm();
  }
  showEditBucketlistItemForm() {
    this.setState({ editBucketlistItemForm: true})
  }

  hideEditBucketlistItemForm() {
    this.setState({ editBucketlistItemForm: false})
  }

  handleUpdateBucketlistItem(event) {
    event.preventDefault();
    this.updateBucketlistItem(this.state.bucketlistId, this.state.itemId, this.state.itemName);
    this.hideEditBucketlistItemForm();
  }

  updateBucketlistItem(bucketlistId, itemId, itemName) {
    if (itemName === '') {
      return;
    }
    request
      .put('http://life-plans.herokuapp.com/api/v1/bucketlists/'+bucketlistId+'/items/'+itemId)
      .set('Authorization', localStorage
            .getItem('token'))
      .send({"name": itemName})
      .end((err, result) => {
        if (result.status === 200) {
          this.props.fetchBucketlistItems(bucketlistId);
        } else {
        }
      });
  }

  deleteBucketlistItem(bucketlistId, itemId) {
    if (bucketlistId === '' || bucketlistId === 0 || bucketlistId === undefined) {
      return;
    }
    if (itemId === '' || itemId === 0 || itemId === undefined) {
      return;
    }
    request
      .delete('http://life-plans.herokuapp.com/api/v1/bucketlists/'+bucketlistId+'/items/'+itemId)
      .set('Authorization', localStorage
            .getItem('token'))
      .end((err, result) => {
        if (result.status === 200) {
          console.log("Success on delete");
          this.props.fetchAllBucketlists();
          this.props.fetchBucketlistItems(bucketlistId);
        } else {
        }
      });
  }

  displaySingleBucketlistItem(bucketlistId, item) {
    return (
        <div className="row"  key={item.id}>
          <div id={item.id} className="single-bucketlist-item">
            <a>{item.name} </a>
            <div className="manage">
              <a onClick={()=>this.handleEditBucketlistItem(bucketlistId, item.id, item.name)}><span className="glyphicon glyphicon-pencil" title="Edit this bucetlist"></span></a>
              <OverlayTrigger
                trigger="click"
                container={document.body}
                placement="top"
                show={this.state.showDeletePopover}
                onHide={() => this.setState({ showDeletePopover: false })}
                  overlay={
                  <Popover id = {bucketlistId} title="Do you really want to delete this item?">
                    <a style={{ 'marginLeft': 60, position: 'relative' }} className="btn btn-danger" onClick={()=>this.deleteBucketlistItem(bucketlistId, item.id)}>Yes</a>
                    <a style={{ 'marginLeft': 30, position: 'relative' }} className="btn btn-primary"
                    onClick={() => this.hideDeletePopover()}>No</a>

                  </Popover>}>
                  <a><span className="glyphicon glyphicon-trash" title="Delete this item"></span></a>
              </OverlayTrigger>
            </div>
          </div>
        </div>

    );
  }

  displayBucketlistItemsTitle(bucketlistId, bucketlistName) {
    if (bucketlistId === 0 || bucketlistId === '' || bucketlistId === undefined) {
        return (
          <div> No bucketlist selected. </div>
        )
    }
    else {
      return (
        <div> Items for {this.props.bucketlistName}
        </div>
      )
    }
  }

  hideDeletePopover() {
    console.log(this.state.showDeletePopover)
    this.setState({ showDeletePopover: false })
  }

  render() {
    let closeEditBucketlistItemForm = () => this.setState({ editBucketlistItemForm: false });
    const props = this.props;
    return(
      <div>
      <div className="bucket-list-item-title"> {this.displayBucketlistItemsTitle(props.bucketlistId, props.bucketlistName)}
      {this.displayBucketlistItems(props.bucketlistId, props.items)}

      </div>

      <BucketListItemModalForm
        show={this.state.editBucketlistItemForm}
        onHide={closeEditBucketlistItemForm}
        handleFieldChange={this.handleFieldChange}
        onSave={this.handleUpdateBucketlistItem}
        formtitle={"Edit this item"}
        required={false}
        itemName={this.state.itemName}
      />
      </div>

    );
  }
}
