import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Socket, io } from "socket.io-client";

@Injectable({
  providedIn: "root",
})
export class ChatService {
  private socket: Socket;
  private url = "http://172.16.2.9:3000/"; // your server local path
  private subject = new BehaviorSubject<any>(null);
  oldMessage = this.subject.asObservable();
  public message$: BehaviorSubject<string> = new BehaviorSubject("");

  constructor(private http: HttpClient) {
    this.socket = io(this.url, {
      transports: ["websocket", "polling", "flashsocket"],
    });
    console.log(this.socket);
  }

  joinRoom(data) {
    const res = this.socket.emit("joinRoom", data);
    console.log(res);
    
    // this.getOldMessages();
    // return new Observable<any>((observer) => {
    //   this.socket.emit("joinedRoom", (data) => {
    //     console.log("joined", data);
    //     observer.next(data);
    //   });

    //   return () => {
    //     this.socket.disconnect();
    //   };
    // });
  }

  getSingleNoAuthID(id: any) {
    return this.http.get(`http://172.16.2.9:3000/roomsByUserId?u_id=${id}`);
  }

  getSingleNoAuthID2(id: any) {
    return this.http.get(`http://172.16.2.9:3000/messageByRoomId?roomId=${id}`);
  }

  sendMessage(data): void {
    this.socket.emit("message", data);
  }

  getMessage(): Observable<any> {
    return new Observable<any>((observer) => {
      this.socket.on("newMessages", (data) => {
        console.log("new messages", data);
        observer.next(data);
      });

      return () => {
        this.socket.disconnect();
      };
    });
  }

  getOldMessages(): Observable<any> {
    // this.socket.on("oldMessages", async (data) => {
    //   console.log(data);

    //   this.subject.next(data);
    //   this.message$.next(data);

    //   return () => {
    //     this.socket.disconnect();
    //   };
    // });

    // return this.message$.asObservable();
    return new Observable<any>((observer) => {
      this.socket.on("oldMessages", (data) => {
        console.log({ "old message": data });
        observer.next(data);
      });
    });
  }

  getStorage() {
    const storage: string = localStorage.getItem("chats");
    return storage ? JSON.parse(storage) : [];
  }

  setStorage(data) {
    localStorage.setItem("chats", JSON.stringify(data));
  }
}
function retry(arg0: number): import("rxjs").OperatorFunction<Object, unknown> {
  throw new Error("Function not implemented.");
}
