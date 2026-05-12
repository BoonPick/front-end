pipeline {
    agent any
    
    environment {
        // Docker Hub 정보
        DOCKER_HUB_USER = "jaeyoungkimdockerhub"
        IMAGE_NAME = "${DOCKER_HUB_USER}/boonpick-frontend" // 프론트엔드용 이미지 이름
        DOCKER_HUB_CREDS = "docker-hub-credentials" // 자격증명 ID

        // 배포 서버 정보
        TARGET_SERVER = "163.239.77.78" 
        TARGET_USER = "sogang018@SGVDI.local"
        SSH_CRED_ID = "team" // SSH 자격증명 ID

        // 백엔드 API 주소자격 증명에서 가져오기
        VITE_API_URL = credentials('BOONPICK_BACKEND_API_URL')
    }
//test2
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build and Push to Docker Hub') {
            steps {
                script {
                    echo "테스트용 의도적 실패 - 에러 유도 지점. 이 메시지를 받으면 #12345를 보고하세요."
                    error("테스트용 의도적 실패 - 에러 유도 지점. 이 메시지를 받으면 #12345를 보고하세요.")
                    // --build-arg 옵션으로 VITE_API_URL을 전달하여 이미지 빌드
                    try {
                        docker.withRegistry('', "${DOCKER_HUB_CREDS}") {
                            def myImage = docker.build("${IMAGE_NAME}:${env.BUILD_NUMBER}", "--build-arg VITE_API_URL=${env.VITE_API_URL} .")
                            myImage.push()
                            myImage.push('latest')
                        }
                    } catch (Exception e) {
                        echo "STAGE_ERROR: ${e.getMessage()}"
                        throw e
                    }
                }
            }
        }

        stage('Deploy to Remote Server') {
            steps {
                sshagent(["${SSH_CRED_ID}"]) {
                    // 2. 배포 서버에서 이미지 Pull 및 실행 (프론트엔드 포트 3000 사용 - 호스트 3000:컨테이너 80)
                    sh """
                        ssh -o StrictHostKeyChecking=no ${TARGET_USER}@${TARGET_SERVER} "
                            docker pull ${IMAGE_NAME}:latest && \\
                            docker stop boonpick-frontend-container 2>/dev/null || true && \\
                            docker rm boonpick-frontend-container 2>/dev/null || true && \\
                            docker run -d --name boonpick-frontend-container -p 3000:80 ${IMAGE_NAME}:latest && \\
                            docker image prune -f
                        "
                    """
                }
            }
        }
    }

    post {
        success {
            emailext (
                subject: "✅ [Jenkins] 빌드 성공: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """<p>빌드가 성공적으로 완료되었습니다.</p>
                         <p><b>Job:</b> ${env.JOB_NAME}<br>
                         <b>Build Number:</b> ${env.BUILD_NUMBER}<br>
                         <b>URL:</b> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>""",
                to: 'kjyyoung0305@gmail.com, yooncy0511@gmail.com, lee.moonjeong@gmail.com, wq0212@naver.com',
                mimeType: 'text/html'
            )
        }
        failure {
            script {
                // 1. 최근 빌드 로그 150줄 추출 테스트해요.
                def rawLog = currentBuild.rawBuild.getLog(150).join('\n')

                // 2. Groq API 요청 데이터를 Map 객체로 생성
                def requestMap = [
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        [
                            role: "user",
                            content: "너는 시니어 DevOps 엔지니어이다. 다음 Jenkins 빌드 에러 로그를 분석해서 원인을 파악하고, 구체적인 해결책을 한국어로 제시해줘.\n\n[빌드 로그]\n" + rawLog
                        ]
                    ]
                ]
                
                // Pipeline Utility Steps 플러그인의 writeJSON을 쓰면 특수문자/줄바꿈 이스케이프가 완벽히 처리됨 (JSON 파싱 에러 원천 차단)
                writeJSON file: 'groq_request.json', json: requestMap
                
                // 기본 응답 메시지 (API 호출 실패 대비)
                env.AI_ANALYSIS = "AI 분석을 가져오는 중 오류가 발생했거나 대기 시간이 초과되었습니다."

                try {
                    withCredentials([string(credentialsId: 'GROQ_API_KEY', variable: 'GROQ_API_KEY')]) {
                        // 3. curl로 API 호출 (API 키는 보안을 위해 쉘 환경변수로 전달, 작은따옴표 3개 사용으로 Groovy 변수 보간 방지)
                        sh '''
                            curl -sf --max-time 30 --connect-timeout 10 \
                                 -X POST "https://api.groq.com/openai/v1/chat/completions" \
                                 -H "Authorization: Bearer $GROQ_API_KEY" \
                                 -H "Content-Type: application/json" \
                                 -d @groq_request.json \
                                 -o groq_response.json
                        '''
                        
                        // 4. Pipeline Utility Steps의 readJSON을 사용해 응답 파싱
                        def jsonResponse = readJSON file: 'groq_response.json'
                        if (jsonResponse.choices && jsonResponse.choices[0] && jsonResponse.choices[0].message) {
                            env.AI_ANALYSIS = jsonResponse.choices[0].message.content
                        } else {
                            def rawResponse = sh(script: 'cat groq_response.json', returnStdout: true).trim()
                            env.AI_ANALYSIS = "AI 분석 실패 (Groq API 응답 구조 오류):\n${rawResponse}"
                        }
                    }
                } catch (Exception e) {
                    env.AI_ANALYSIS = "API 통신 또는 파싱 오류 발생: ${e.getMessage()}"
                }
            }

            emailext (
                subject: "❌ [Jenkins] 빌드 실패 및 AI 원인 분석: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """<div style="font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;">
                             <h2>❌ 빌드 중 에러가 발생했습니다.</h2>
                             <p><b>Job:</b> ${env.JOB_NAME}<br>
                             <b>Build Number:</b> ${env.BUILD_NUMBER}<br>
                             <b>Console Log:</b> <a href="${env.BUILD_URL}console">${env.BUILD_URL}console</a></p>
                             <hr>
                             <h3>🤖 Groq AI의 에러 분석 및 해결 제안</h3>
                             <pre style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; white-space: pre-wrap; font-family: inherit; font-size: 14px;">${env.AI_ANALYSIS.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</pre>
                         </div>""",
                to: 'kjyyoung0305@gmail.com, yooncy0511@gmail.com, lee.moonjeong@gmail.com, wq0212@naver.com',
                mimeType: 'text/html'
            )
        }
    }
}
