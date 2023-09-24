import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { ChatService } from "./services/chat/chat.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild("popup", { static: false }) popup: any;

  public roomId: any;
  public messageText: any;
  public messageArray: any = [];
  private storageArray = [];

  public showScreen = false;
  public phone: any;
  public currentUser;
  public selectedUser;
  public roomList: any;
  public userList = [
    {
      first_name: "Eum voluptatibus quo",
      name: "Eum voluptatibus quo",
      u_id: "f894eb82-de9a-47a5-a6d6-18651050a1f1",
      _id: "650b0202a1421ca2219d64a3",
      phone: "9876598765",
      id: "650b0202a1421ca2219d64a3",
      createdAt: "2023-09-20T14:30:26.567Z",
      updatedAt: "2023-09-20T14:30:26.567Z",
      image: "assets/user/user-1.png",
      roomId: "650b0202a1421ca2219d64a3",
      __v: 0,
    },
    {
      first_name: "Quia cillum voluptat",
      name: "Quia cillum voluptat",
      u_id: "14dd2afe-12d0-418a-a51d-4b697ac11f67",
      _id: "650b01e5a1421ca2219d64a1",
      phone: "9876543210",
      image: "assets/user/user-3.png",
      id: "650b01e5a1421ca2219d64a1",
      roomId: "650b01e5a1421ca2219d64a1",
      createdAt: "2023-09-20T14:29:57.619Z",
      updatedAt: "2023-09-20T14:29:57.619Z",
      __v: 0,
    },
  ];

  constructor(
    private modalService: NgbModal,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.chatService.getMessage().subscribe((data: any) => {
      // this.messageArray.push(data);
      if (this.roomId) {
        console.log(data);
        this.messageArray.push(data);
        // setTimeout(() => {
        //   this.storageArray = this.chatService.getStorage();
        //   const storeIndex = this.storageArray.findIndex(
        //     (storage) => storage.roomId === this.roomId
        //   );
        //   this.messageArray = this.storageArray[storeIndex].chats;
        // }, 500);
      }
    });

    this.chatService.getOldMessages().subscribe(
      (data: any) => {
        console.log({ messages: data });
        if (this.roomId) {
          console.log(data);
          this.messageArray.push(data);
        }
      },
      (err) => {
        console.log(err);
      }
    );

    if (this.roomId) {
      this.getMessages();
    }
  }

  getAllRooms() {
    this.chatService.getSingleNoAuthID(this.currentUser.id).subscribe(
      (res: any) => {
        console.log(res);
        this.roomList = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getMessages() {
    console.log(this.roomId);
    this.chatService.getSingleNoAuthID2(this.roomId).subscribe(
      (res: any) => {
        console.log(res);
        // this.messa = res;
        // this.messageArray = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  ngAfterViewInit(): void {
    this.openPopup(this.popup);
  }

  openPopup(content: any): void {
    this.modalService.open(content, { backdrop: "static", centered: true });
  }

  login(dismiss: any): void {
    this.currentUser = this.userList.find(
      (user) => user.phone === this.phone.toString()
    );
    this.userList = this.userList.filter(
      (user) => user.phone !== this.phone.toString()
    );

    if (this.currentUser) {
      this.showScreen = true;
      this.getAllRooms();
      dismiss();
    }
  }

  selectUserHandler(data: any, users: any): void {
    let getUsers = this.returnName(data);
    this.selectedUser = this.userList.find((user) => user.id === getUsers?._id);
    this.roomId = data?.roomId;
    this.messageArray = [];

    this.storageArray = this.chatService.getStorage();
    const storeIndex = this.storageArray.findIndex(
      (storage) => storage.roomId === this.roomId
    );

    if (storeIndex > -1) {
      this.messageArray = this.storageArray[storeIndex].chats;
    }

    // this.currentUser.name, this.roomId
    this.join({ users: [this.currentUser.id, this.selectedUser.id] });
  }

  join(data: any): void {
    this.chatService.joinRoom(data);
    // this.getMessages();
    // this.chatService.getOldMessages();
  }

  returnName(user: any) {
    return user?.users.find((n: any) => n?._id !== this.currentUser.id);
  }

  sendMessage(): void {
    // room,
    // message,
    // sender,
    // listing,
    // roomId

    this.chatService.sendMessage({
      sender: this.currentUser.u_id,
      room: this.roomId,
      roomId: this.roomId,
      listing: this.currentUser.u_id,
      message: this.messageText,
    });

    // this.storageArray = this.chatService.getStorage();
    // const storeIndex = this.storageArray.findIndex(
    //   (storage) => storage.roomId === this.roomId
    // );

    // if (storeIndex > -1) {
    //   this.storageArray[storeIndex].chats.push({
    //     user: this.currentUser.name,
    //     message: this.messageText,
    //   });
    // } else {
    //   const updateStorage = {
    //     roomId: this.roomId,
    //     chats: [
    //       {
    //         user: this.currentUser.name,
    //         message: this.messageText,
    //       },
    //     ],
    //   };

    //   this.storageArray.push(updateStorage);
    // }

    // this.chatService.setStorage(this.storageArray);
    this.messageText = "";
  }
}
