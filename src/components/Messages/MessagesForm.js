import React from 'react'
import uuidv4 from 'uuid/v4'
import FileModal from './FileModal'
import { Segment, Button, Input } from 'semantic-ui-react'
import firebase from '../../firebase'

class MessagesForm extends React.Component {
    state = {
        user: this.props.currentUser,
        message: " ",
        percentUploaded: 0,
        channel: this.props.currentChannel,
        loading: false,
        errors: [],
        modal: false,
        uploadState: '',
        uploadTask: null,
        storageRef: firebase.storage().ref()
    }

    openModal = () => this.setState({ modal: true })

    closeModal = () => this.setState({ modal: false })


    handleChange = event => {
        this.setState( {  [event.target.name]: event.target.value } );
    }

    createMessage = ( fileUrl = null )=> {
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: this.state.user.uid,
                name: this.state.user.displayName,
                avatar: this.state.user.photoURL
            },
            content: this.state.message
        }
        console.log(fileUrl)
        if ( fileUrl !== null ) {
            console.log(fileUrl)
            message['image'] = fileUrl;
        } else {
            message['content'] = this.state.message
        }
        return message
    }

    sendMessage = () => {
        const { messagesRef } = this.props
        const { message, channel } = this.state

        if ( message ) {
            this.setState({ loading: true })
            messagesRef
                .child(channel.id)
                .push()
                .set(this.createMessage())
                .then(() => {
                    this.setState({ loading: false, message: '', errors: []})
                })
                .catch( err => {
                    console.error(err)
                    this.setState({
                        loading: false,
                        errors: this.state.errors.concat(err)
                    })
                })
        } else {
            this.setState({
                errors: this.state.errors.concat({ message: 'Add a message'})
            })
        }

    }

    uploadFile = (file, metaData) => {
        const pathToUpload = this.state.channel.id;
        const ref = this.props.messagesRef;
        const filePath = `chat/public/${uuidv4()}.jpg`

        this.setState({
            uploadState: 'uploading',
            uploadTask: this.state.storageRef.child(filePath).put(file, metaData)
        },
        () => {
            this.state.uploadTask.on('state_changed', snap=> {
                const percentUploaded = Math.round(( snap.bytesTransferred / snap.totalBytes ) * 100)
                this.setState({ percentUploaded });
            },
                err => {
                    console.error(err);
                    this.setState({
                        errors: this.state.errors.concat(err),
                        uploadState: 'error',
                        uploadTask: null
                    })
                },
                () => {
                    this.state.uploadTask.snapshot.ref.getDownloadURL().then(downloadUrl => {
                        console.log(downloadUrl)
                        this.sendFileMessage(downloadUrl, ref, pathToUpload)
                    })
                    .catch(err => {
                        console.error(err);
                        this.setState({
                            errors: this.state.errors.concat(err),
                            uploadState: 'error',
                            uploadTask: null
                        })
                    })
                }
            )
        }
    )
}


    sendFileMessage = ( fileUrl, ref, pathToUpload ) =>{
        console.log()
        ref.child(pathToUpload)
        .push()
        .set(this.createMessage(fileUrl))
        .then(() => {
            this.setState({ uploadState: 'done'})
        })
        .catch( err => {
            console.error(err)
            this.setState({
                errors: this.state.errors.concat(err)
            })
        })
    }

    render() {
        const { errors, message, loading, modal } = this.state

        console.log(this.state.uploadState)

        return (
            <Segment className="message__form">
                <Input
                  fluid
                  name="message"
                  style={{ marginBottom: '07em' }}
                  label={<Button icon={'add'} />}
                  labelPosition="left"
                  value={message}
                  onChange={this.handleChange}
                  placeholder="Write your message"
                  className = {
                      errors.some(error => error.message.includes('message') ) ? 'error' : ''
                  }
                />
                <Button.Group icon widths="2">
                    <Button
                      onClick={this.sendMessage}
                      disabled={loading}
                      color="orange"
                      content="Add Reply"
                      labelPosition="left"
                      icon="edit"
                    />
                    <Button
                      onClick={this.openModal}
                      color="teal"
                      content="Upload Media"
                      labelPosition="right"
                      icon="cloud upload"
                    />
                    <FileModal modal={modal}  closeModal={this.closeModal} uploadFile={this.uploadFile} />
                </Button.Group>
            
            </Segment>

        )
    }
}

export default (MessagesForm)