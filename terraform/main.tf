provider "aws" {
  region = var.aws_region
}

# Menggunakan ECR yang sudah ada
data "aws_ecr_repository" "todo_list" {
  name = var.ecr_repo_name
}

# Security Group (gunakan data source agar tidak hardcode)
data "aws_security_group" "default_sg" {
  id = var.security_group_id
}

resource "aws_instance" "todo_ec2" {
  ami           = var.ami_id
  instance_type = var.instance_type
  key_name      = var.key_name
    associate_public_ip_address = true
  security_groups = [data.aws_security_group.default_sg.name]

  user_data = <<-EOF
              #!/bin/bash
              apt-get update -y
              apt-get install -y docker.io awscli
              systemctl start docker
              usermod -aG docker ubuntu
              su - ubuntu -c "aws ecr get-login-password --region ${var.aws_region} | docker login --username AWS --password-stdin ${data.aws_ecr_repository.todo_list.repository_url}"
              docker pull ${data.aws_ecr_repository.todo_list.repository_url}:latest
              docker run -d -p 80:80 ${data.aws_ecr_repository.todo_list.repository_url}:latest
              EOF

  tags = {
    Name        = "todo-list-ec2"
    Environment = "dev"
    Project     = "todo-list-devops"
  }
}