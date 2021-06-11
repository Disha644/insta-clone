import React, { useContext, useState } from 'react';

import Input from '../UI/Input/Input';
import Form from '../UI/Form/Form';
import Popup from './Popup/Popup';
import capitalizeName from '../../utility/capitalizeName'
import { UserContext } from '../../App';
import classes from './Post.css';
import { useHistory } from 'react-router';

const Post = (props) => {

    const { post } = props;
    const { user } = useContext(UserContext);
    const liked = post.likes.includes(user._id);
    const history = useHistory();

    const [show, setShow] = useState(false);

    const viewUserProfile = () => {
        let url = '/profile';
        if (post.postedBy._id !== user._id) {
            url = url + '/' + post.postedBy._id
        }
        history.push(url);
    }

    return (
        <div className={classes.Post}>

            <div style={{ display: 'flex', alignItems: 'center' }}>

                <p className={classes.username} onClick={viewUserProfile}>
                    {capitalizeName(post.postedBy.name)}
                </p>

                {post.postedBy._id === user._id ?
                    <i className="fas fa-ellipsis-v" style={{ color: '#525052', fontSize: '0.8rem', position: 'relative', cursor: 'pointer', zIndex: '10' }} onClick={() => setShow(!show)}>
                        <Popup show={show} delete={() => props.delete(post._id)} />
                    </i> : null
                }

            </div>

            <img src={post.picture} alt="post" />
            <div className={classes.icons}>
                {liked ?
                    <>
                        <i className="fas fa-heart" style={{ color: 'red' }}></i>
                        <i className="far fa-thumbs-down" onClick={() => props.unlike(post._id)}></i>
                    </> :
                    <>
                        <i className="far fa-heart"></i>
                        <i className="far fa-thumbs-up" onClick={() => props.like(post._id)}></i>
                    </>
                }
            </div>

            <p className={classes.normal}>{post.likes.length === 1 ? '1 like' : post.likes.length + ' likes'}</p>
            <p className={classes.bold}>{post.title}</p>
            <p className={classes.normal}>{post.body}</p>

            <div style={{ marginTop: '8px' }}>
                {post.comments.map(c =>
                    <p className={classes.comment} key={c._id}>
                        <span style={{ fontWeight: '500' }}>{capitalizeName(c.postedBy.name)}</span> {c.text}
                    </p>
                )}
            </div>


            <Form onSubmit={(e) => {
                e.preventDefault();
                props.comment(e.target[0].value, post._id);
                e.target.reset();
            }}>
                <Input type="text" placeholder="Add comment" />
            </Form>

        </div >
    );
}

export default Post;