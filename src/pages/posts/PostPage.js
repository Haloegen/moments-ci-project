import React, { useEffect, useState } from "react";
import { axiosReq } from "../../api/axiosDefaults";
import CommentCreateForm from "../comments/CommentCreateForm";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import appStyles from "../../App.module.css";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import Post from "./Post";
import Comment from '../comments/Comment';

function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState({results: []});


const currentUser = useCurrentUser();
const profile_image = currentUser?.profile_image;
const [comments, setComments] = useState({ results: [] });
 

useEffect(() => {
    const handleMount = async () => {
      try {
        const [{data: post}, {data: comments}] = await  Promise.all([
          axiosReq.get(`/posts/${id}`),
          axiosReq.get(`/comments/?posts=${id}`)
        ])
        setPost({results: [post]})
        setComments(comments);
      } catch(err){
        console.log(err)
      }
    }

    handleMount();
  }, [id]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <p>Popular profiles for mobile</p>
        <Post {...post.results[0]} setPosts={setPost} postPage/>
        <Container className={appStyles.Content}>
        {currentUser ? (
  <CommentCreateForm
  profile_id={currentUser.profile_id}
  profileImage={profile_image}
  post={id}
  setPost={setPost}
  setComments={setComments}
/>
) : comments.results.length ? (
  "Comments"
) : null}
{comments.results.length ? (
  comments.results.map(comment => (
    <Comment setPost={setPost} setComments={setComments} key={comment.id} {...comment}/>
  ))
) : currentUser ? (
  <span>No comments, yet. Be the first to comment</span>

) : (
  <span>No comments yet</span>
)
}
        </Container>
      </Col>
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        Popular profiles for desktop
      </Col>
    </Row>
  );
}

export default PostPage;