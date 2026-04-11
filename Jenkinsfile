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
                    // --build-arg 옵션으로 VITE_API_URL을 전달하여 이미지 빌드
                    docker.withRegistry('', "${DOCKER_HUB_CREDS}") {
                        def myImage = docker.build("${IMAGE_NAME}:${env.BUILD_NUMBER}", "--build-arg VITE_API_URL=${env.VITE_API_URL} .")
                        myImage.push()
                        myImage.push('latest')
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
            emailext (
                subject: "❌ [Jenkins] 빌드 실패: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """<p>빌드 중 에러가 발생했습니다. 로그를 확인해 주세요.</p>
                         <p><b>Job:</b> ${env.JOB_NAME}<br>
                         <b>Build Number:</b> ${env.BUILD_NUMBER}<br>
                         <b>Console Log:</b> <a href="${env.BUILD_URL}console">${env.BUILD_URL}console</a></p>""",
                to: 'kjyyoung0305@gmail.com, yooncy0511@gmail.com, lee.moonjeong@gmail.com, wq0212@naver.com',
                mimeType: 'text/html'
            )
        }
    }
}
