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
                    // 1. 도커 허브 로그인 및 이미지 빌드/푸시
                    docker.withRegistry('', "${DOCKER_HUB_CREDS}") {
                        def myImage = docker.build("${IMAGE_NAME}:${env.BUILD_NUMBER}")
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
}
