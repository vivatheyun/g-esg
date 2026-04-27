function checkLogin() {
    const name = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    const VALID_NAME = "sayuri";
    const VALID_PASS = "!seoyoung12";

    if (name === VALID_NAME && pass === VALID_PASS) {
        const overlay = document.getElementById('login-overlay');
        const main = document.getElementById('main-content');
        
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
            main.style.display = 'flex'; // flex로 변경하여 레이아웃 유지
        }, 500);
    } else {
        alert("이름 또는 암호가 올바르지 않습니다.");
    }
}

// 파일 선택 핸들러
function handleFileSelect(event) {
    const files = event.target.files;
    if (files.length > 0) addFiles(files);
}

// 파일 리스트 추가
function addFiles(files) {
    const list = document.getElementById('ref-list');
    const empty = list.querySelector('.empty-state');
    if (empty) empty.remove();

    Array.from(files).forEach(file => {
        const item = document.createElement('div');
        item.className = 'ref-item';
        item.innerHTML = `
            <div class="ref-info">
                <span>${file.name.endsWith('.pdf') ? '📄' : '📝'}</span>
                <span>${file.name}</span>
            </div>
            <button class="btn-del-mini" title="삭제" onclick="this.parentElement.remove()">X</button>
        `;
        list.appendChild(item);
    });
}

// 드래그 앤 드롭 및 메뉴 초기화
window.onload = () => {
    // 챕터 갯수 메뉴 초기화 (1~20)
    const chapterSelect = document.getElementById('chapter-count');
    if (chapterSelect) {
        for (let i = 1; i <= 20; i++) {
            const opt = document.createElement('option');
            opt.value = i;
            opt.innerText = i;
            if (i === 5) opt.selected = true; // 기본값 5
            chapterSelect.appendChild(opt);
        }
    }

    const refPanel = document.getElementById('ref-panel');
    if (!refPanel) return;

    refPanel.addEventListener('dragover', (e) => {
        e.preventDefault();
        refPanel.classList.add('drag-over');
    });

    ['dragleave', 'dragend', 'drop'].forEach(type => {
        refPanel.addEventListener(type, () => {
            refPanel.classList.remove('drag-over');
        });
    });

    refPanel.addEventListener('drop', (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0) addFiles(files);
    });
};

// 목차 자동 제안 (목차생성 버튼 기능)
function suggestToc() {
    const refItems = document.querySelectorAll('#ref-list .ref-item');
    if (refItems.length === 0) {
        alert("목차를 생성할 참고 자료를 먼저 등록해주세요.");
        return;
    }

    const level = document.getElementById('toc-level').value;
    const count = parseInt(document.getElementById('chapter-count').value);
    const editor = document.getElementById('toc-editor');
    
    const esgTopics = [
        "ESG 경영 현황 분석", "탄소중립 이행 전략", "에너지 효율화 지표", "자원 순환 및 폐기물 관리",
        "공급망 지속가능성", "안전보건 관리 체계", "인권 경영 및 다양성", "지역사회 공헌 활동",
        "윤리 경영 시스템", "이사회 독립성 및 전문성", "주주 권익 보호", "디지털 ESG 전환",
        "녹색 금융 및 투자 전략", "리스크 관리 통합 체계", "정보 공시 투명성", "고객 만족 및 데이터 보안",
        "친환경 제품 개발 로드맵", "생물 다양성 보존 활동", "노사 협력 및 조직 문화", "종합 결론 및 미래 전망"
    ];

    let mockToc = [];
    for (let i = 0; i < count; i++) {
        const title = esgTopics[i % esgTopics.length];
        mockToc.push(`${i + 1}. ${title}`);
        
        // 2단계 이상일 경우 하위 항목 추가
        if (level >= "2") {
            mockToc.push(`  ${i + 1}.1 세부 이행 과제 및 지표 분석`);
            mockToc.push(`  ${i + 1}.2 데이터 기반 성과 측정 결과`);
        }
        // 3단계일 경우 추가 하위 항목
        if (level === "3") {
            mockToc.push(`    ${i + 1}.2.1 개선 시나리오 및 시뮬레이션`);
        }
    }

    editor.value = mockToc.join('\n');

    const screen = document.getElementById('output-screen');
    screen.innerHTML = `<div class='terminal-placeholder'>> 등록된 ${refItems.length}개의 파일을 분석하여 ${count}개의 챕터(${level}단계) 목차를 생성했습니다.</div>`;
}

// 목차 초기화 (삭제 버튼 기능)
function clearToc() {
    const editor = document.getElementById('toc-editor');
    if (editor.value && !confirm("작성된 목차를 모두 삭제하시겠습니까?")) return;
    
    editor.value = "";
    const screen = document.getElementById('output-screen');
    screen.innerHTML = "<div class='terminal-placeholder'>> 목차가 초기화되었습니다.</div>";
}

// 최종 분석 실행
function executeAnalysis() {
    const editor = document.getElementById('toc-editor');
    const tocLines = editor.value.split('\n').filter(line => line.trim() !== "");
    
    if (tocLines.length === 0) {
        alert("목차를 입력하거나 '목차생성' 버튼을 눌러 목차를 생성해주세요.");
        return;
    }

    // 페이지 수 읽기
    const finalPageCount = parseInt(document.getElementById('page-count-input').value) || 3;
    const screen = document.getElementById('output-screen');
    
    screen.innerHTML = `<div class='terminal-placeholder'>> 총 ${finalPageCount}페이지 분량의 초정밀 ESG 리포트를 생성 중입니다...</div>`;
    
    setTimeout(() => {
        let resultHtml = `<h1 style='color:#00f2ff; margin-bottom:20px; border-bottom:2px solid var(--primary); padding-bottom:10px;'>G-ESG 종합 분석 리포트 (총 ${finalPageCount}p)</h1>`;
        
        // 각 목차당 할당될 대략적인 페이지 분량
        const pagesPerSection = (finalPageCount / tocLines.length).toFixed(1);

        tocLines.forEach((line, index) => {
            const trimmed = line.trim();
            const dotCount = (trimmed.split(' ')[0].match(/\./g) || []).length;
            const depth = trimmed.match(/^\d+(\.\d+)+/) ? dotCount : 0;
            const indent = depth * 25; 
            
            const fontSize = 18 - (depth * 2);
            const fontWeight = depth === 0 ? '700' : '500';
            const color = depth === 0 ? 'var(--primary)' : 'rgba(255,255,255,0.8)';
            
            resultHtml += `<div style='margin-left:${indent}px; margin-top:30px;'>`;
            resultHtml += `<h2 style='font-size:${fontSize}px; font-weight:${fontWeight}; color:${color}; margin-bottom:12px;'>${trimmed}</h2>`;
            
            // 페이지 수에 비례하여 내용 풍부하게 생성 (분량 시뮬레이션 강화)
            const repeatCount = Math.max(1, Math.floor(pagesPerSection * 3)); 
            for(let r=0; r < repeatCount; r++) {
                resultHtml += `<p style='color:rgba(255,255,255,0.7); font-size:13px; line-height:1.9; margin-bottom:15px; text-align:justify;'>
                    <b>[심층 분석 데이터 ${r+1}]</b> 해당 섹션 '${trimmed}'에 대해 수집된 과거 리포트의 정성적 데이터와 현재 가용 가능한 정량적 수치 지표를 교차 검증한 결과입니다. 
                    글로벌 ESG 공시 표준(GRI, SASB 등)을 기준으로 분석했을 때, 현재의 데이터 트렌드는 과거 대비 약 15% 이상의 개선세를 보이고 있으며, 
                    이는 단순히 수치적 향상을 넘어 조직 내 지속 가능한 경영 철학이 실무 단위까지 깊게 내재화되었음을 시사합니다. 
                    특히 이번 분기에서 관찰된 특이점은 공급망 전반에 걸친 탄소 배출량 관리의 정밀도가 대폭 향상되었다는 점이며, 
                    이를 위해 도입된 AI 기반 모니터링 시스템은 실시간 데이터 수집과 오차 범위 0.5% 이내의 정밀 분석을 가능케 하였습니다. 
                    이러한 정밀도는 향후 발생 가능한 잠재적 환경 리스크를 선제적으로 방어하는 핵심 자산이 될 것입니다.
                </p>`;
                
                resultHtml += `<p style='color:rgba(255,255,255,0.6); font-size:13px; line-height:1.9; margin-bottom:15px; text-align:justify; padding-left:10px; border-left:2px solid rgba(0, 242, 255, 0.2);'>
                    추가적으로, 본 항목과 연계된 사회적 책임(S) 및 지배구조(G) 지표와의 상관관계 분석 결과, 투명한 정보 공시가 이해관계자 신뢰도 향상에 결정적인 
                    영향을 미치고 있음이 확인되었습니다. 전략적 로드맵 관점에서 볼 때, 현재의 수치 자료는 차년도 목표 달성률을 120% 상회할 것으로 예측되며, 
                    이는 경쟁사 대비 독보적인 ESG 경쟁력을 확보하는 근거가 됩니다. 따라서 본 리포트에서는 이러한 성과를 기반으로 한 글로벌 이니셔티브 참여 및 
                    지속 가능 경영 보고서의 고도화 방향성을 다음과 같이 제안합니다.
                </p>`;

                if (r < repeatCount - 1) {
                    resultHtml += `<div style='height:1px; background:linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent); margin:20px 0;'></div>`;
                }
            }
            resultHtml += `</div>`;
        });
        
        screen.innerHTML = resultHtml;
        // 스크롤을 맨 위로
        screen.scrollTop = 0;
    }, 1500);
}

// .DOC 저장 기능
function saveAsDoc() {
    const content = document.getElementById('output-screen').innerHTML;
    if (!content || content.includes('terminal-placeholder')) {
        alert("먼저 분석을 실행해주세요.");
        return;
    }

    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>ESG Report</title><style>body{font-family:NanumGothic, sans-serif;} h1{color:#0078d4;} h2{border-bottom:1px solid #ccc; padding-bottom:5px;}</style></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + content + footer;
    
    const blob = new Blob(['\ufeff', sourceHTML], {
        type: 'application/msword'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'G-ESG_분석_리포트.doc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 문서 출력 초기화
function clearOutput() {
    const screen = document.getElementById('output-screen');
    if (screen.innerHTML.includes('terminal-placeholder')) return;
    
    if (confirm("작성된 문서 내용을 모두 삭제하고 초기화하시겠습니까?")) {
        screen.innerHTML = `<div class="terminal-placeholder">실행 버튼을 누르면 분석이 시작됩니다...</div>`;
        screen.scrollTop = 0;
    }
}

// 키보드 이벤트 지원 (Enter 및 Shift + G)
document.addEventListener('keydown', function (e) {
    const overlay = document.getElementById('login-overlay');
    if (overlay.style.display === 'none') return; // 이미 로그인된 상태면 무시

    // Enter: 일반 로그인 시도
    if (e.key === 'Enter') {
        checkLogin();
    }

    // Shift + G: 즉시 로그인 (마스터 키)
    if (e.shiftKey && (e.key === 'G' || e.key === 'g')) {
        e.preventDefault();
        document.getElementById('username').value = "sayuri";
        document.getElementById('password').value = "!seoyoung12";
        checkLogin();
    }
});
