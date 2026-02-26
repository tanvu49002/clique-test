# ❤️ Dating App - Match & Date Scheduler
Một ứng dụng hẹn hò thu nhỏ (Dating App prototype) cho phép người dùng khám phá các hồ sơ, kết nối dựa trên sở thích chung và đặc biệt là tính năng Tự động chốt lịch hẹn dựa trên thời gian rảnh trùng nhau.

## 🚀 Công nghệ sử dụng
Framework: Next.js 16 (App Router).

Ngôn ngữ: TypeScript.

Styling: Tailwind CSS.

Quản lý dữ liệu: LocalStorage.

Thư viện hỗ trợ: react-hook-form, zod, react-hot-toast.

## 📂 Cấu trúc thư mục dự án:

src/
├── app/
│ └── explore/
│ └── page.tsx # Trang chính điều phối logic và giao diện
├── components/
│ └── explore/ # Các UI Component đã được tách nhỏ
│ ├── ExploreHeader.tsx # Thanh Header và bộ chuyển đổi vai người dùng
│ ├── ExploreTabs.tsx # Thanh điều hướng các Tab (Khám phá, Đã thích bạn,...)
│ ├── MatchedTabContent.tsx # Nội dung chi tiết của Tab "Đã ghép đôi"
│ ├── ProfileCard.tsx # Thẻ hiển thị thông tin người dùng
│ ├── ScheduleModal.tsx # Modal quản lý và thiết lập lịch rảnh
│ └── EmptyState.tsx # Hiển thị khi danh sách trống
├── libs/
│ └── storage.ts # Các hàm tương tác với LocalStorage
├── types/
│ └── index.ts # Định nghĩa các Interface dữ liệu
├── utils/
│ └── date.ts # Các hàm helper xử lý logic ngày, tháng, giờ

## 🛠 Cách chạy dự án

Thực hiện lần lượt các câu lệnh dưới đây để chạy dự án ở môi trường dev:
```bash
git clone [url-du-an]
npm install
npm run dev
```
Truy cập: Mở trình và truy cập vào http://localhost:3000.

## 🛠 Dữ liệu hệ thống được quản lý qua các Key trên LocalStorage như sau:

1. dating_users: Mảng các user có trong hệ thống, mỗi user gồm các thông tin: id, email, name, gender, address, image, age, bio.
2. dating_schedules: Mảng các thông tin lịch rảnh, lịch rảnh gồm các thông tin: date, startTime, endTime, fromEmail, toEmail.
3. liked_list: Mảng lưu các lượt thích, lượt thích gồm các thông tin: fromEmail, toEmail.
4. matched_list: Mảng chứa các cặp đôi đã match thành công, thông tin 1 cặp match thành công bao gồm: id, matchedAt, user1Email, user2Email.
5. passed_list: Mảng chứa danh sách bỏ qua tạm thời, 1 lượt bỏ qua tạm thời bao gồm các thông tin: fromEmail, toEmail.
6. rejected_list: Mảng chứa danh sách từ chối vĩnh viễn, 1 lượt từ chối vĩnh viễn bao gồm các thông tin: fromEmail, toEmail.

## ✨ Tính năng & Logic xử lý:

1. Tạo hồ sơ người dùng (Create Profile)
   - Cách dùng: Người dùng nhập đầy đủ các thông tin cá nhân (Tên, tuổi, sở thích,...) và nhấn "Lưu profile" để khởi tạo.

   - Logic xử lý: Sử dụng thư viện react-hook-form để xử lý thông tin form và sử dụng Zod để validate form.Thông tin sẽ được lưu trữ vào mảng "dating_users" trong LocalStorage.

   - Lưu ý: Ảnh đại diện là không bắt buộc; nếu trống, hệ thống tự động gán ảnh mặc định (default-image.png). Sau khi tạo xong sẽ được chuyển đến trang chính /explore. nếu muốn tạo thêm profile để test có thể nhấn nút Profile trên header để quay lại tạo thêm profile.

2. Cơ chế đóng vai
   - Cách dùng: trên Header tại trang chính sẽ có 1 combobox "đóng vai" chứa toàn bộ tên user đã tạo, chọn 1 user đồng nghĩa với việc anh/chị đã đăng nhập vào tài khoản của user đó để thuận tiện cho việc test.
   - Logic xử lý: sử dụng state currentUserEmail tại component cha để xác định ai đang được đóng vai, khi đổi người khác sẽ cập nhật lại state này và gọi lại tất cả các hàm truy suất dữ liệu từ localStorage để update lại thông tin theo người được đóng vai.
3. Khám phá hồ sơ (Explore)
   - Cách dùng: Khám phá/Xem các hồ sơ đã có trên ứng dụng. Nhấn Tim để Like hoặc X để bỏ qua hồ sơ.
   - Logic xử lý: Hệ thống sẽ lọc ra danh sách người dùng dựa trên 3 điều kiện: Không phải bản thân, không nằm trong danh sách đã like (liked_list), không nằm trong danh sách đã bỏ qua (passed_list hoặc rejected_list) và không nằm trong danh sách bỏ qua vĩnh viễn (rejected_list). Các list này đều được lưu trong localStorage.
   - Lưu ý: khi nhấn X (bỏ qua) hệ thống sẽ tự add 1 object vào mảng passed_list, object này có 2 key là fromEmail và toEmail để biết ai đã pass qua ai. khi đã pass qua 1 người, người đó sẽ không còn hiện bên mục "khám phá" nữa mà sẽ xuất hiện bên mục "Lịch sử" (dành cho việc người dùng lỡ tay bấm X với một người mà chưa kịp đọc profile của họ, có thể vào đây xem lại). Ngược lại nếu bấm biểu tượng trái tim (Like) thì hệ thống sẽ add 1 object vào mảng liked_list cũng với 2 field fromEmail và toEmail để đánh dấu việc người A đã like người B.

4. Mục "Đã thích bạn"
   - Cách dùng: Xem các profile đã bấm like bạn.
   - Logic xử lý: hệ thống sẽ dùng liked_list để lọc ra những người có bản ghi like gửi tới currentUserEmail (chỉ hiển thị 1 người like bạn sớm nhất, thao tác bỏ qua hoặc like lại người đó để hiện tiếp những người tiếp theo).
   - Lưu ý: nếu ở trong Tab "Đã thích bạn" người dùng bấm X với 1 profile đã like mình thì hệ thống sẽ thêm 1 object vào mảng rejected_list cũng gồm 2 key là fromEmail và toEmail. lúc này profile đó sẽ không chuyển qua lịch sử mà sẽ biến mất, không thể lướt trúng nữa. Nếu người dùng bấm tim (like) thì hàm saveLike sẽ kiểm tra trong liked_list xem trước đó user đó có bấm like bạn chưa, nếu có object đó tồn tại trong liked_list thì hệ thống sẽ tự động thêm 1 object vào matched_list thể hiện 2 user này đã match nhau.

5. Mục "Lịch sử"
   - Cách dùng: Xem lại những người bạn đã bấm "X" ở tab Lịch sử. Tại đây, nếu bấm "X" một lần nữa, họ sẽ bị Reject vĩnh viễn.

   - Logic xử lý: Người bị Pass sẽ được lưu vào passed_list và biến mất khỏi tab "Khám phá". nếu bấm pass thêm 1 lần nữa thì sẽ được đưa vào mảng rejected_list và sau này không thể lướt thấy nữa. Nếu bấm tim (like) thì logic tương tự như like bình thường và sẽ được xoá khỏi passed_list đối với currentUserEmail đó

6. Mục "Đã ghép đôi"
   - Cách dùng: Xem danh sách những người bạn đã like và họ cũng like lại bạn (matched) lúc này sẽ có nút "tạo lịch rảnh" để bạn tạo lịch rảnh cho 21 ngày tiếp theo (3 tuần).
   - Logic xử lý: Dùng matched_list và dating_users để lọc ra list các profile đã match với bạn (có thể xem lại profile chi tiết). Khi lưu 1 lịch rảnh cho 1 ngày, hệ thống add thêm 1 object vào mảng dating_shcedules với các thông tin: ngày, giờ bắt đầu, giờ kết thúc, fromEmail, toEmail để biết tạo lịch rảnh này cho ai.
   - Lưu ý: nếu có lịch rảnh trùng nhau hệ thống sẽ tự thống nhất 1 cuộc hẹn cho cả 2 và cũng hiển thị trong tab "Đã ghép đôi" này với màu sắc nổi bật.
7. Logic so sánh thời gian rảnh
   - Logic xử lý: Hệ thống sẽ truy cập vào dating_schedules để lọc ra toàn bộ khung giờ rảnh của user A dành cho user B và ngược lại. Sau đó tiến hành so sánh bằng 2 vòng lặp lồng nhau, một lịch hẹn được coi là trùng khớp khi thoả mãn đủ cả 3 yếu tố: trùng date, trùng giờ bắt đầu và trùng cả giờ kết thúc. Sau khi đã lọc ra được list các lịch rảnh trùng nhau giữa 2 người, tiến hành sort lại theo trình tự thời gian tăng dần để lấy thời gian rảnh gần nhất và hiển thị cho cả 2 user.

## 🛠️ Cải thiện và phát triển nếu có thêm thời gian:
    - Sử dụng BackEnd để xử lý và lưu dữ liệu vào Database.
    - Tích hợp thêm hệ thống Authentication.
    - Tối ưu Performance, UI/UX tốt hơn.
    - Thêm nhiều thông tin cho user hơn để mọi người có thể hiểu rõ nhau hơn.

## 🛠️ Tính năng đề xuất & Lý do:
    1. Tính năng Chat Real-time: 
        - Lý do: Sau khi Match hoặc chốt lịch, người dùng cần kênh giao tiếp để trao đổi chi tiết thêm thông tin hoặc có thể tự điều chỉnh lịch cho phù hợp với nhau hơn.
    2. Filter profile (trang khám phá) theo sở thích người dùng:
        - Lý do: cá nhân hoá trang khám phá để chỉ nhìn thấy những người thực sự "đúng gu".
    3. Validate hình ảnh profile:
        - Lý do: AI hiện nay đang ngày càng phát triển và sẽ có nhiều người dùng nó để tự tạo ảnh profile của mình nhằm nhiều mục đích xấu khác nhau, cần phải validate để chắc chắn rằng đó là ảnh thật của bản thân họ và sau đó có thể cho họ 1 thứ tựa như "tích xanh" giống facebook để người khác có thể yên tâm khi lướt trúng user này.

