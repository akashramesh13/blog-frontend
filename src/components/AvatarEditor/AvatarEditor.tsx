import React, { useMemo, useState } from 'react';
import { createAvatar } from "@dicebear/core";
import * as openPeeps from "@dicebear/open-peeps";
import * as avataaars from "@dicebear/avataaars";
import * as bottts from "@dicebear/bottts";
import * as micah from "@dicebear/micah";
import * as pixelArt from "@dicebear/pixel-art";
import * as lorelei from "@dicebear/lorelei";
import axios from '../../helpers/axios';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/reducers';
import { getProfile } from '../../redux/actions/profileActions';
import './AvatarEditor.scss';

const STYLE_MAP: Record<string, any> = {
  "open-peeps": openPeeps,
  "avataaars": avataaars,
  "bottts": bottts,
  "micah": micah,
  "pixel-art": pixelArt,
  "lorelei": lorelei,
};

interface AvatarEditorProps {
  isOpen: boolean;
  onClose: () => void;
  initialConfig?: any;
  profileId?: string;
}

const AvatarEditor: React.FC<AvatarEditorProps> = ({ isOpen, onClose, initialConfig, profileId }) => {
  const dispatch = useDispatch<any>();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [isSaving, setIsSaving] = useState(false);

  const [style, setStyle] = useState(initialConfig?.style || "open-peeps");
  const [seed, setSeed] = useState(initialConfig?.seed || "Akash");
  const [head, setHead] = useState(initialConfig?.head || "short1");
  const [expression, setExpression] = useState(initialConfig?.expression || "smile");
  const [accessory, setAccessory] = useState(initialConfig?.accessory || "glasses");
  const [skin, setSkin] = useState(initialConfig?.skin || "ffdbb4");
  const [shirt, setShirt] = useState(initialConfig?.shirt || "8fa7df");

  const avatarUri = useMemo(() => {
    return createAvatar(STYLE_MAP[style] || openPeeps, {
      seed,
      head: [head],
      face: [expression],
      accessories: [accessory],
      skinColor: [skin],
      clothingColor: [shirt],
      size: 350,
    }).toDataUri();
  }, [style, seed, head, expression, accessory, skin, shirt]);

  const heads = ["short1", "short5", "long", "longCurly", "afro", "bun", "twists", "mohawk", "hatBeanie"];
  const expressions = ["smile", "smileBig", "serious", "calm", "cute", "eyesClosed", "angryWithFang"];
  const accessories = ["glasses", "glasses2", "glasses3", "sunglasses", "eyepatch"];
  const skins = ["ffdbb4", "edb98a", "d08b5b", "ae5d29", "694d3d"];
  const shirts = ["8fa7df", "78e185", "ffcf77", "e279c7", "e78276", "9ddadb"];

  function randomize() {
    setSeed(Math.random().toString(36).substring(2));
    setHead(heads[Math.floor(Math.random() * heads.length)]);
    setExpression(expressions[Math.floor(Math.random() * expressions.length)]);
    setAccessory(accessories[Math.floor(Math.random() * accessories.length)]);
    setSkin(skins[Math.floor(Math.random() * skins.length)]);
    setShirt(shirts[Math.floor(Math.random() * shirts.length)]);
  }

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const configObj = { style, seed, head, expression, accessory, skin, shirt };
      const avatarStr = JSON.stringify(configObj);
      await axios.put('/profile/avatar', { avatar: avatarStr });
      
      if (userInfo) {
        const updatedUserInfo = { ...userInfo, avatar: avatarStr };
        localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
        dispatch({ type: "LOGIN_SUCCESS", payload: updatedUserInfo });
      }
      
      await dispatch(getProfile(profileId));
      onClose();
    } catch (e) {
      console.error("Failed to save avatar", e);
      alert("Failed to save avatar");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="avatar-editor-modal-overlay">
      <div className="avatar-editor-modal">
        <h2>Avatar Studio</h2>
        
        <div className="avatar-editor-modal__preview">
          <img src={avatarUri} width={200} alt="avatar" />
        </div>

        <button className="avatar-editor-modal__randomize" onClick={randomize}>
          🎲 Random Person
        </button>

        <p className="avatar-editor-modal__disclaimer">
          Note: This is only used for generating a visual avatar. We do not store any demographic information or gender in our database.
        </p>

        <div className="avatar-editor-modal__controls">
          <label>Avatar Style
            <select value={style} onChange={(e) => setStyle(e.target.value)}>
              <option value="open-peeps">Open Peeps</option>
              <option value="bottts">Bottts (Robots)</option>
              <option value="avataaars">Avataaars</option>
              <option value="micah">Micah</option>
              <option value="pixel-art">Pixel Art</option>
              <option value="lorelei">Lorelei</option>
            </select>
          </label>

          {style === "open-peeps" && (
            <>
              <label>Head
            <select value={head} onChange={(e) => setHead(e.target.value)}>
              <option value="short1">Short</option>
              <option value="short5">Buzz</option>
              <option value="long">Long</option>
              <option value="longCurly">Long Curly</option>
              <option value="afro">Afro</option>
              <option value="bun">Bun</option>
              <option value="twists">Twists</option>
              <option value="mohawk">Mohawk</option>
              <option value="hatBeanie">Beanie</option>
            </select>
          </label>

          <label>Expression
            <select value={expression} onChange={(e) => setExpression(e.target.value)}>
              <option value="smile">Smile</option>
              <option value="smileBig">Big Smile</option>
              <option value="serious">Serious</option>
              <option value="calm">Calm</option>
              <option value="cute">Cute</option>
              <option value="eyesClosed">Eyes Closed</option>
              <option value="angryWithFang">Angry</option>
            </select>
          </label>

          <label>Accessory
            <select value={accessory} onChange={(e) => setAccessory(e.target.value)}>
              <option value="glasses">Glasses</option>
              <option value="glasses2">Glasses 2</option>
              <option value="glasses3">Glasses 3</option>
              <option value="sunglasses">Sunglasses</option>
              <option value="eyepatch">Eyepatch</option>
            </select>
          </label>

          <label>Skin Color
            <select value={skin} onChange={(e) => setSkin(e.target.value)}>
              <option value="ffdbb4">Light</option>
              <option value="edb98a">Tan</option>
              <option value="d08b5b">Brown</option>
              <option value="ae5d29">Dark Brown</option>
              <option value="694d3d">Deep</option>
            </select>
          </label>

          <label>Shirt Color
            <select value={shirt} onChange={(e) => setShirt(e.target.value)}>
              <option value="8fa7df">Blue</option>
              <option value="78e185">Green</option>
              <option value="ffcf77">Yellow</option>
              <option value="e279c7">Pink</option>
              <option value="e78276">Red</option>
              <option value="9ddadb">Cyan</option>
            </select>
          </label>
            </>
          )}
        </div>

        <div className="avatar-editor-modal__actions">
          <button className="cancel-btn" onClick={onClose} disabled={isSaving}>Cancel</button>
          <button className="save-btn" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Avatar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarEditor;
