/**
 * Google 시트에 문의 데이터를 저장하는 Web App 스크립트
 *
 * 설정 방법:
 * 1. 새 Google 시트를 만들고, 첫 행에 열 이름을 입력합니다 (예: 일시 | 관심분야 | 이메일 | 기타문의)
 * 2. 확장 프로그램 → Apps Script
 * 3. 이 파일 내용을 붙여넣고 저장
 * 4. 배포 → 새 배포 → 유형: 웹 앱
 *    - 실행 사용자: 나
 *    - 앱에 액세스할 수 있는 사용자: 모든 사용자 (또는 "앱에 액세스할 수 있는 사용자: anyone")
 * 5. 배포 후 나오는 "웹 앱 URL"을 복사하여 .env에 VITE_GOOGLE_SCRIPT_URL 로 넣습니다
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var params = e.parameter; // form POST로 전달된 필드

    var interest = params.interest || '';
    var email = params.email || '';
    var inquiry = params.inquiry || '';
    var timestamp = new Date();

    sheet.appendRow([timestamp, interest, email, inquiry]);

    // iframe으로 제출한 경우 이 HTML이 보입니다. 필요하면 메시지 수정 가능
    return ContentService.createTextOutput(
      '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><script>window.parent.postMessage({ type: "form-submitted", success: true }, "*");</script>제출되었습니다.</body></html>'
    ).setMimeType(ContentService.MimeType.HTML);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
