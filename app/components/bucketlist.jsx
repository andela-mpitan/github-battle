import React, { Component } from 'react';
import BucketListItem from './bucketlistitem.jsx';
import BucketListModalForm from './bucketlist-modal.jsx';
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

export default class BucketList extends Component {
    constructor(props) {
        super(props);
        this.onbucketlistClick = this.onbucketlistClick.bind(this);
        this.deleteBucketlist = this.deleteBucketlist.bind(this);
        this.displayAllBucketlists = this.displayAllBucketlists.bind(this);
        this.displaySingleBucketlist = this.displaySingleBucketlist.bind(this);
        this.fetchBucketlistItems = this.fetchBucketlistItems.bind(this);
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleSaveNewBucketlistItem = this.handleSaveNewBucketlistItem.bind(this);
        this.saveNewBucketlistItem = this.saveNewBucketlistItem.bind(this);
        this.submitNewBucketlistItem = this.submitNewBucketlistItem.bind(this);
        this.showNewBucketlistItemForm = this.showNewBucketlistItemForm.bind(this);
        this.showEditBucketlistForm = this.showEditBucketlistForm.bind(this);
        this.handleEditBucketlist = this.handleEditBucketlist.bind(this);
        this.handleUpdateBucketlist = this.handleUpdateBucketlist.bind(this);
        this.updateBucketlist = this.updateBucketlist.bind(this);
        this.hideDeletePopover = this.hideDeletePopover.bind(this);
        this.state = {
          items: [],
          bucketlists: [],
          bucketlistName: '',
          bucketlistId: 0,
          itemName: '',
          showDeletePopover: false,
          itemDoneStatus: false
        }
    }

    onbucketlistClick(bucketlistId, bucketlistName) {
      if (bucketlistId === '' || bucketlistId === undefined) {
        this.setState({items: []});
      }
      else {
        this.setState({
          bucketlistId: bucketlistId,
          bucketlistName: bucketlistName
        });
        this.fetchBucketlistItems(bucketlistId);
      }
    }

    deleteBucketlist(bucketlistId) {
      if (bucketlistId === '' || bucketlistId === 0 || bucketlistId === undefined) {
        return;
      }
      request
        .delete('http://life-plans.herokuapp.com/api/v1/bucketlists/'+bucketlistId)
        .set('Authorization', localStorage
              .getItem('token'))
        .end((err, result) => {
          if (result.status === 200) {
            this.props.fetchAllBucketlists();
          } else {
          }
        });
    }

    handleSaveNewBucketlistItem(bucketlistId, bucketlistName) {
      this.setState({
        bucketlistId: bucketlistId,
        bucketlistName: bucketlistName,
      });
      this.showNewBucketlistItemForm();
    }

    handleFieldChange(event) {
        event.preventDefault();
        let key = event.target.name;
        let value = event.target.value;
        this.setState({
            [key]: value
        });
    }
    showNewBucketlistItemForm() {
      this.setState({ newBucketlistItemForm: true });
    }
    submitNewBucketlistItem(event) {
      event.preventDefault();
      this.saveNewBucketlistItem(this.state.bucketlistId, this.state.itemName);
      this.hideNewBucketlistItemForm();
    }
    saveNewBucketlistItem(bucketlistId, itemName) {
      if (itemName === '') return

      request
        .post('http://life-plans.herokuapp.com/api/v1/bucketlists/'+bucketlistId+'/items/')
        .set('Authorization', localStorage
              .getItem('token'))
        .send({"name": itemName })
        .end((err, result) => {
          if (result.status === 201) {
            this.props.fetchAllBucketlists();
            this.fetchBucketlistItems(bucketlistId)
          } else {
            //console.log(result.status);
            console.log("error");
          }
        });
    }

    hideNewBucketlistItemForm() {
      this.setState({ newBucketlistItemForm: false });
    }

    handleEditBucketlist(bucketlistId, bucketlistName) {
      this.setState({
        bucketlistId: bucketlistId,
        bucketlistName: bucketlistName
      });
      this.showEditBucketlistForm();
    }

    showEditBucketlistForm() {
      this.setState({ editBucketlistForm: true });
    }
    hideEditBucketlistForm() {
      this.setState({ editBucketlistForm: false });
    }

        // Why is the state the same with the function here?
    handleUpdateBucketlist(event) {
      event.preventDefault();
      this.updateBucketlist(this.state.bucketlistId, this.state.bucketlistName);
      this.hideEditBucketlistForm();
    }

    updateBucketlist(bucketlistId, bucketlistName) {
      if (bucketlistName === '') {
        return;
      }
      request
        .put('http://life-plans.herokuapp.com/api/v1/bucketlists/'+bucketlistId)
        .set('Authorization', localStorage
              .getItem('token'))
        .send({"name": bucketlistName})
        .end((err, result) => {
          if (result.status === 200) {
            this.props.fetchAllBucketlists();
          } else {
          }
        });
    }


    /**
    componentWillUnMount() {
      this.setState({bucketlists: this.props.bucketlists});
    }
    **/

    displayAllBucketlists() {
        if (this.props.bucketlists.length > 0) {
          return (
            this.props.bucketlists.map((bucketlist) => {
              return (
                this.displaySingleBucketlist(bucketlist)
              );
          })
          );
        }
        else {
          return (
            <div>
              No bucketlist yet. Click the Create New bucketlist
               to start creating a bucketlist
            </div>
        );
        };

    }
    hideDeletePopover() {
      console.log(this.state.showDeletePopover)
      this.props.fetchAllBucketlists();
    }
    displaySingleBucketlist(bucketlist) {
      return (
          <div className="row"  key={bucketlist.id}>
            <div className="single-bucketlist">
              <a className="btn btn-default" onClick={()=>this.onbucketlistClick(bucketlist.id, bucketlist.name)} >{bucketlist.name}<span> ({bucketlist.items.length})</span></a>
              <div className="manage">
                <a onClick={()=>this.handleSaveNewBucketlistItem(bucketlist.id, bucketlist.name)}><span className="glyphicon glyphicon-plus" title="Add Items"></span></a>
                <a onClick={()=>this.handleEditBucketlist(bucketlist.id, bucketlist.name)}><span className="glyphicon glyphicon-pencil" title="Edit this bucetlist"></span></a>

                <OverlayTrigger
                  trigger="click"
                  container={document.body}
                  placement="top"
                  target={() => ReactDOM.findDOMNode(this.refs.target)}
                  show={this.state.showDeletePopover}
                  onHide={() => this.setState({ showDeletePopover: false })}
                    overlay={
                    <Popover id = {bucketlist.id} title="Do you really want to delete this bucketlist?">
                      <a style={{ 'marginLeft': 60, position: 'relative' }} className="btn btn-danger" onClick={()=>this.deleteBucketlist(bucketlist.id)}>Yes</a>
                      <a style={{ 'marginLeft': 30, position: 'relative' }} className="btn btn-primary"
                      onClick={() => this.hideDeletePopover()}>No</a>

                    </Popover>}>
                    <a> <span className="glyphicon glyphicon-trash" title="Delete this bucketlist"></span></a>
                </OverlayTrigger>


              </div>
            </div>
          </div>

    );
  }

    fetchBucketlistItems(bucketlistId) {
      request
        .get('https://life-plans.herokuapp.com/api/v1/bucketlists/'+bucketlistId)
        .set('Authorization', localStorage
              .getItem('token'))
        .end((err, result) => {
          if (result.status === 200) {
            //console.log("success");
            this.setState({
              items: result.body.items,
            });
          } else {
            this.setState({
              items: [],
            });
          }
        });
    }
    render() {

      let closeEditBucketlistForm = () => this.setState({ editBucketlistForm: false})
      let closeNewBucketistItemForm = () => this.setState({ newBucketlistItemForm: false });
      return(
        <div>
          <div className="bucket-list">
            {this.displayAllBucketlists()}
          </div>

          <div className="bucket-list-items">
            <BucketListItem bucketlistId = {this.state.bucketlistId} bucketlistName = {this.state.bucketlistName} items={this.state.items} fetchAllBucketlists={this.props.fetchAllBucketlists} fetchBucketlistItems={this.fetchBucketlistItems}/>
          </div>

          <BucketListItemModalForm
            show={this.state.newBucketlistItemForm}
            onHide={closeNewBucketistItemForm}
            handleFieldChange={this.handleFieldChange}
            onSave={this.submitNewBucketlistItem}
            formtitle={"Add an item to " + this.state.bucketlistName}
            placeholder="Enter item name"
            required={true}
          />



          <BucketListModalForm
            show={this.state.editBucketlistForm}
            onHide={closeEditBucketlistForm}
            bucketlistName = {this.state.bucketlistName}
            handleFieldChange={this.handleFieldChange}
            onSave={this.handleUpdateBucketlist}
            formtitle="Edit Bucketlist"
          />

        </div>
      );
    }
}
