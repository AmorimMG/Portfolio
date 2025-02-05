pipeline {
        agent any

        environment {
            REGISTRY = 'amorimmg/portfolio'
            DOCKER_TAG = "1.$BUILD_NUMBER"
        }

        stages {
            stage('Docker Stop Previous Build') {
                steps {
                    script {
                        def containers = sh(script: "docker ps -a --format \"{{.ID}} {{.Image}}\" | grep $REGISTRY | awk '{print \$1}'", returnStdout: true).trim().split()
                        for (container in containers) {
                            sh "docker stop $container || true"
                        }
                    }
                }
            }

            stage('Docker Build Image') {
                steps {
                    script {
                        docker.build(REGISTRY, "-f Dockerfile . -t $REGISTRY:$DOCKER_TAG")
                    }
                }
            }

            stage('Docker Push Image') {
                steps {
                    script {
                        withCredentials([
                            usernamePassword(
                                credentialsId: 'docker_cred',
                                usernameVariable: 'USERNAME',
                                passwordVariable: 'PASSWORD'
                            )
                        ]) {
                            sh "docker login -u $USERNAME -p $PASSWORD"
                            docker.image(REGISTRY).push(DOCKER_TAG)
                        }
                    }
                }
            }

            stage('Deploy New Container') {
                steps {
                    script {
                        sh "docker run --restart=always --name $CONTAINER-$DOCKER_TAG --network bridge -d -p 5173:5173/tcp $REGISTRY:$DOCKER_TAG"
                    }
                }
            }
        }
		
		 post {
            success {
                script {
                    def containers = sh(script: "docker ps -a --filter \"status=exited\" --format \"{{.ID}} {{.Image}}\" | grep $REGISTRY | awk '{print \$1}'", returnStdout: true).trim().split()
                    for (container in containers) {
                        sh "docker rm -v $container || true"
                    }
                }
            }
            failure {
                script {
                    sh "docker stop $REGISTRY:$DOCKER_TAG || true"
                    sh "docker rm -v $REGISTRY:$DOCKER_TAG || true"
                    def containers = sh(script: "docker ps -a --filter \"status=exited\" --format \"{{.ID}} {{.Image}}\" | grep $REGISTRY | awk '{print \$1}'", returnStdout: true).trim().split()
                    for (container in containers) {
                        sh "docker start $container || true"
                    }
                }
            }
        }
}