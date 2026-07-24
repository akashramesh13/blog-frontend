import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";
import { getProfile } from "../../redux/actions/profileActions";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import Loading from "../Loading/Loading";
import AvatarEditor from '../AvatarEditor/AvatarEditor';
import AvatarImage from '../AvatarImage/AvatarImage';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from '../../helpers/axios';
import toast from 'react-hot-toast';
import { IPost } from '../../types/postsTypes';
import Post from '../Post/Post';
import { useHistory } from 'react-router-dom';
import "./Profile.scss";

const EditIcon = () => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
  </svg>
);

type AppDispatch = ThunkDispatch<RootState, void, AnyAction>;

const Profile: React.FC = () => {
  const { profileId } = useParams<{ profileId?: string }>();

  const dispatch = useDispatch<AppDispatch>();
  const { loading, username, avatar, bio, profileTitle } = useSelector(
    (state: RootState) => state.profile,
  );
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const [isEditorOpen, setIsEditorOpen] = React.useState(false);
  const [isEditingBio, setIsEditingBio] = React.useState(false);
  const [bioContent, setBioContent] = React.useState("");

  const [isEditingTitle, setIsEditingTitle] = React.useState(false);
  const [titleContent, setTitleContent] = React.useState("");
  const [isSavingBio, setIsSavingBio] = React.useState(false);
  const [isSavingTitle, setIsSavingTitle] = React.useState(false);
  const history = useHistory();

  // Tab State
  const [activeTab, setActiveTab] = React.useState<"about" | "posts" | "liked">("about");
  const [userPosts, setUserPosts] = React.useState<IPost[]>([]);
  const [likedPosts, setLikedPosts] = React.useState<IPost[]>([]);
  const [loadingPosts, setLoadingPosts] = React.useState(false);

  React.useEffect(() => {
    if (bio) setBioContent(bio);
    if (profileTitle) setTitleContent(profileTitle);
  }, [bio, profileTitle]);

  const isOwnProfile = !profileId || profileId === userInfo?.id;
  const targetProfileId = profileId || userInfo?.id;

  useEffect(() => {
    dispatch(getProfile(targetProfileId));
  }, [dispatch, targetProfileId]);

  useEffect(() => {
    if (activeTab === "posts" && targetProfileId) {
      setLoadingPosts(true);
      axios.get(`/posts/user/${targetProfileId}?size=50`).then(res => {
        setUserPosts(res.data.content || []);
      }).finally(() => setLoadingPosts(false));
    } else if (activeTab === "liked" && targetProfileId) {
      setLoadingPosts(true);
      axios.get(`/posts/liked/${targetProfileId}?size=50`).then(res => {
        setLikedPosts(res.data.content || []);
      }).finally(() => setLoadingPosts(false));
    }
  }, [activeTab, targetProfileId]);

  const handleSaveBio = async () => {
    try {
      setIsSavingBio(true);
      await axios.put('/profile/bio', { bio: bioContent });
      await dispatch(getProfile(profileId));
      setIsEditingBio(false);
      toast.success("Bio updated successfully!");
    } catch (e) {
      console.error("Failed to save bio", e);
      toast.error("Failed to save bio");
    } finally {
      setIsSavingBio(false);
    }
  };

  const handleSaveTitle = async () => {
    try {
      setIsSavingTitle(true);
      await axios.put('/profile/title', { profileTitle: titleContent });
      await dispatch(getProfile(profileId));
      setIsEditingTitle(false);
      toast.success("Title updated successfully!");
    } catch (e) {
      console.error("Failed to save title", e);
      toast.error("Failed to save title");
    } finally {
      setIsSavingTitle(false);
    }
  };

  if (loading && !username) return <Loading />;

  return (
    <div className="profile">
      <div className="profile__header">
        <div className="profile__avatar-container">
          <div className="profile__avatar">
            <AvatarImage
              avatarString={avatar}
              size={120}
              fallback={username ? username.charAt(0).toUpperCase() : "U"}
            />
          </div>
          {isOwnProfile && (
            <button className="edit-avatar-btn" onClick={() => setIsEditorOpen(true)}>
              Edit Avatar
            </button>
          )}
        </div>
        <div className="profile__info">
          {isEditingTitle ? (
            <div className="profile__title-editor">
              <input 
                type="text" 
                value={titleContent} 
                onChange={(e) => setTitleContent(e.target.value)}
                placeholder="Enter a title..."
              />
              <button className="save-btn" onClick={handleSaveTitle} disabled={isSavingTitle}>{isSavingTitle ? "Saving..." : "Save"}</button>
              <button className="cancel-btn" onClick={() => { setIsEditingTitle(false); setTitleContent(profileTitle || ""); }} disabled={isSavingTitle}>Cancel</button>
            </div>
          ) : (
            <h1 className="profile__title">
              {profileTitle || (isOwnProfile ? "My Profile" : `${username}'s Profile`)}
              {isOwnProfile && (
                <button className="icon-btn" onClick={() => setIsEditingTitle(true)} title="Edit Title">
                  <EditIcon />
                </button>
              )}
            </h1>
          )}
          <p className="profile__subtitle">@{username}</p>
        </div>
      </div>

      <div className="profile__tabs" style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid #eee', marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab("about")}
          style={{ background: 'none', border: 'none', borderBottom: activeTab === "about" ? '2px solid #333' : '2px solid transparent', padding: '10px 0', fontSize: '1.1rem', cursor: 'pointer', fontWeight: activeTab === "about" ? 600 : 400 }}
        >
          About Me
        </button>
        <button 
          onClick={() => setActiveTab("posts")}
          style={{ background: 'none', border: 'none', borderBottom: activeTab === "posts" ? '2px solid #333' : '2px solid transparent', padding: '10px 0', fontSize: '1.1rem', cursor: 'pointer', fontWeight: activeTab === "posts" ? 600 : 400 }}
        >
          Posts
        </button>
        <button 
          onClick={() => setActiveTab("liked")}
          style={{ background: 'none', border: 'none', borderBottom: activeTab === "liked" ? '2px solid #333' : '2px solid transparent', padding: '10px 0', fontSize: '1.1rem', cursor: 'pointer', fontWeight: activeTab === "liked" ? 600 : 400 }}
        >
          Liked Posts
        </button>
      </div>

      <div className="profile__content">
        {activeTab === "about" && (
          <>
            <div className="profile__bio-header">
              <h2>About {isOwnProfile ? 'Me' : username}</h2>
              {isOwnProfile && !isEditingBio && (
                <button className="edit-bio-btn" onClick={() => setIsEditingBio(true)}>
                  <EditIcon /> Edit Bio
                </button>
              )}
            </div>
            
            {isEditingBio ? (
              <div className="bio-editor">
                <ReactQuill theme="snow" value={bioContent} onChange={setBioContent} />
                <div className="bio-editor-actions">
                  <button className="cancel-btn" onClick={() => { setIsEditingBio(false); setBioContent(bio || ""); }} disabled={isSavingBio}>Cancel</button>
                  <button className="save-btn" onClick={handleSaveBio} disabled={isSavingBio}>{isSavingBio ? "Saving..." : "Save"}</button>
                </div>
              </div>
            ) : (
              <div 
                className="bio-content" 
                dangerouslySetInnerHTML={{ __html: bio || "<p>No bio available.</p>" }} 
              />
            )}
          </>
        )}

        {activeTab === "posts" && (
          <div className="profile__posts">
            {loadingPosts ? <Loading /> : (
              userPosts.length > 0 ? (
                userPosts.map(post => <Post key={post.id} post={post} handleOnPostClick={(p) => history.push(`/post/view/${p.id}`)} />)
              ) : (
                <p>No posts published yet.</p>
              )
            )}
          </div>
        )}

        {activeTab === "liked" && (
          <div className="profile__posts">
            {loadingPosts ? <Loading /> : (
              likedPosts.length > 0 ? (
                likedPosts.map(post => <Post key={post.id} post={post} handleOnPostClick={(p) => history.push(`/post/view/${p.id}`)} />)
              ) : (
                <p>No liked posts yet.</p>
              )
            )}
          </div>
        )}
      </div>

      <AvatarEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        initialConfig={avatar ? JSON.parse(avatar) : {}}
        profileId={profileId}
      />
    </div>
  );
};

export default Profile;
