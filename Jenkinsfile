pipeline {
    agent any
    stages{
        stage("checkout"){
            steps{
                checkout scm
            }
        }

        stage("install"){
            steps{
                sh 'npm install'
            }
        }

        stage("Build"){
            steps{
                sh 'npm run build'
            }
        }

        stage("Build Image"){
            steps{
                sh 'docker build -t portfolio_container:1.0 .'
            }
        }

        stage('Docker Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker_cred', passwordVariable: 'DOCKERHUB_PASSWORD', usernameVariable: 'DOCKERHUB_USERNAME')]) {
                    sh 'docker login -u $DOCKERHUB_USERNAME -p $DOCKERHUB_PASSWORD'
                    sh 'docker tag portfolio_container:1.0 amorimmg/portfolio_container:1.0'
                    sh 'docker push amorimmg/portfolio_container:1.0'
                    sh 'docker logout'
                }
            }
        }

    }
}