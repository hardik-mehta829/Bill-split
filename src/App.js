import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];
function BUTTON({ children, onclick }) {
  return (
    <button className="button" onClick={onclick}>
      {children}
    </button>
  );
}
//We need to lift the state when we need to share the state between sibling componenets.A state is needed whenever there is something which will change in the UI.

// Component is rendered in exactly in the same place .It is not re-rendered again. If we close the componet and open it again then  the states are reset.
export default function App() {
  const [showFriend, setShowFriend] = useState(false);
  const [friendName, setFriendName] = useState("");
  const [imageName, setImageName] = useState("https://i.pravatar.cc/48?u=");
  const [myFriends, setMyFriends] = useState(initialFriends);
  const [selectedFriend, setselectedFriend] = useState(null); //The friend with which we split the bill
  function handleClick() {
    setShowFriend((s) => !s);
  }
  function handleBill(value) {
    // console.log(value);
    setMyFriends(
      myFriends.map((f) =>
        selectedFriend.id === f.id ? { ...f, balance: f.balance + value } : f
      )
    );
    setselectedFriend(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          myFriends={myFriends}
          setselectedFriend={setselectedFriend}
          selectedFriend={selectedFriend}
          setShowFriend={setShowFriend}
        />
        {showFriend && (
          <AddFriend
            friendName={friendName}
            setFriendName={setFriendName}
            imageName={imageName}
            setImageName={setImageName}
            myFriends={myFriends}
            setMyFriends={setMyFriends}
            setShowFriend={setShowFriend}
          />
        )}
        <BUTTON onclick={handleClick}>
          {showFriend ? "Close" : "Add Friend"}
        </BUTTON>
      </div>
      {selectedFriend && (
        <SplitBill
          key={selectedFriend.id} // key is used so that state is reset and a different instance of the same component is rendered
          selectedFriend={selectedFriend}
          handleBill={handleBill}
        />
      )}
    </div>
  );
}
function FriendList({
  myFriends,
  setselectedFriend,
  selectedFriend,
  setShowFriend,
}) {
  const friends = myFriends;
  return (
    <ul>
      {friends.map((f) => {
        return (
          <Friend
            f={f}
            key={f.id}
            setselectedFriend={setselectedFriend}
            selectedFriend={selectedFriend}
            setShowFriend={setShowFriend}
          />
        );
      })}
    </ul>
  );
}
// f is the one friend from the friend list.
function Friend({ f, setselectedFriend, selectedFriend, setShowFriend }) {
  function handleBill() {
    if (selectedFriend && selectedFriend.id === f.id) {
      setselectedFriend(null);
    } else {
      setselectedFriend(f);
      setShowFriend(false);
    }
  }
  return (
    <li
      className={selectedFriend && selectedFriend.id === f.id ? "selected" : ""}
    >
      <img src={f.image} alt="An image " />
      <h3>{f.name}</h3>
      {f.balance < 0 && (
        <p className="red">
          you owe {f.name} {Math.abs(f.balance)}
        </p>
      )}
      {f.balance > 0 && (
        <p className="green">
          {f.name} owe you {Math.abs(f.balance)}
        </p>
      )}
      {f.balance === 0 && <p>you and {f.name} are even</p>}

      <BUTTON onclick={() => handleBill()}>
        {selectedFriend && selectedFriend.id === f.id ? `Close` : "Select"}
      </BUTTON>
    </li>
  );
}
//friendname is the input value of name in form. imagename is input value of image in form.setFriendName and setImageName are setter functions
function AddFriend({
  friendName,
  setFriendName,
  imageName,
  setImageName,
  myFriends,
  setMyFriends,
  setShowFriend,
}) {
  function handleFriendName(e) {
    setFriendName((f) => {
      return e.target.value;
    });
  }
  function handleNewFriend(e) {
    e.preventDefault();
    const id = crypto.randomUUID();
    const newobj = {
      id: Date.now(),
      name: friendName,
      image: `${imageName}${id}`,
      balance: 0,
    };
    if (!friendName || !id) return;
    setMyFriends((myFriends) => [...myFriends, newobj]); //Don't mutate original array so not used push function.
    setFriendName("");
    setImageName("https://i.pravatar.cc/48?u=");
    setShowFriend(null);
  }

  return (
    <form className="form-add-friend">
      <label>Friend Name</label>
      <input
        type="text"
        value={friendName}
        onChange={(e) => handleFriendName(e)}
      />

      <label>Image</label>
      <input type="text" value={imageName} onChange={() => {}} />
      <BUTTON onclick={(e) => handleNewFriend(e)}>Add</BUTTON>
    </form>
  );
}
function SplitBill({ selectedFriend, handleBill }) {
  const [bill, splitBill] = useState("");
  const [myBill, splitMyBill] = useState("");
  const [paidBy, setPaidBy] = useState("user");

  function billDivision(e) {
    splitBill(Number(e.target.value));
  }
  function myExpense(e) {
    // console.log(e.target.value);
    splitMyBill(
      Number(e.target.value) > Number(bill) ? myBill : Number(e.target.value) // myexpense cannot be greater than total expense.
    );
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !myBill) return;
    const paidbyfriend = Number(bill) - Number(myBill);

    paidBy === "user" ? handleBill(paidbyfriend) : handleBill(-myBill);
  }
  return (
    <form className="form-split-bill" onSubmit={(e) => handleSubmit(e)}>
      <h2>Split The Bill {selectedFriend.name}</h2>
      <label>Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => {
          billDivision(e);
        }}
      />
      <label>Your expense</label>
      <input type="text" value={myBill} onChange={(e) => myExpense(e)} />
      <label>{selectedFriend.name}'s expense</label>
      {/* Input for X expense is disabled so that we cannot change because  (your+x) should be equal to total bill value */}
      <input
        type="text"
        value={String(Number(bill) - Number(myBill))}
        disabled
      />
      <label>Who is paying the bill</label>
      <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <BUTTON>Split Bill</BUTTON>
    </form>
  );
}
