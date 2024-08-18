// class Node{
//     constructor(val){// constructor khởi tạo node
//         this.val = val;
//         this.next = null; // next là đây là tham chiếu đến node kế tiếp chứ ko phải là trỏ vào địa chỉ node kế tiếp
//     }
// }

// class linkedList{
//     constructor(){ // constructor khởi tạo head, tail và độ dài(size or length) của list
//         this.head = null;
//         // this.tail = null;
//         this.size = 0;
//     }
//     isEmpty(){ // check empty list
//         return this.size === 0;
//     }

//     getSize(){// trả về kích thước của list
//         return this.size;
//     }

//     insertFirst(val){
//         const newNode = new Node(val);
//         if(this.isEmpty()) {
//             this.head = newNode;
//         }
//         else{
//             newNode.next = this.head;
//             this.head = newNode; 
//         }
//         this.size++;
//     }
//     insertAt(val, index){
//         if(index < 0 || index >= this.size) return
//         if(index == 0) this.insertFirst(val)
//         else{
//             const node = new Node(val);
//             let prev = this.head;
//             for(let i = 0; i < index - 1; i++){
//                 prev = prev.next;
//         }
//         node.next = prev.next;
//         prev.next = node;
//         this.size++;
//         }
//     }


//     // insertFirst(val){   
//     //     const newNode = new Node(val);
//     //     if(this.isEmpty()) {
//     //         this.head = newNode;
//     //         this.tail = this.head;
//     //     }
//     //         newNode.next = this.head; // con trỏ node sẽ trỏ tới head hiện tại
//     //         this.head = newNode;
//     //    
//     //     this.length++; // tăng độ dài linked list sau khi thêm 1 element mới
//     //     return this; // return về toàn bộ linked list mới
//     // }

//     deleteFirst(){
//         let removeNode = this.head;
//         this.head = this.head.next
//         this.size--;
//         return removeNode.val;
//     }  

//     deleteFrom(index){
//         if(index < 0 || index >= this.size) return null;
//         if(index == 0) this.deleteFirst();
//         else{
//             let prev = this.head;
//             for(let i = 0; i < index - 1; i++){
//                 prev = prev.next;
//             }
//             let removeNode = prev.next;
//             prev.next = removeNode.next;
//             this.size--;
//             return removeNode.val;
//         }
//     }

//     printLinkedList(){
//         if(this.isEmpty()){
//             console.log("Danh sach lien ket hien tai empty");
//         }
//         else{
//             let curr = this.head;
//             let listValue = " ";
//             while(curr){ // loop cho đến khi curr == null
//                 listValue += ` ${curr.val}`;
//                 curr = curr.next; // thanh chiếu đến node tiếp theo trong list 
//             }
//         console.log(listValue);
//         }
//     }
//     decimalToBinary(decimal){
//         while(decimal > 0){  
//             this.insertFirst(decimal % 2);
//             decimal = Math.floor(decimal / 2);
//         } 
//     }
// }

// const list = new linkedList();
// list.decimalToBinary(10);
// list.printLinkedList();

function myDisplay(callback){
    callback("hi cc");
}
myDisplay(console.log);
myDisplay((myDisplay) => console.log(myDisplay))