#!/bin/bash

# Levich Interview Task - Docker Management Script
# Usage: ./docker-setup.sh [command]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check for Docker Compose (newer integrated version or legacy standalone)
    if docker compose version &> /dev/null; then
        DOCKER_COMPOSE="docker compose"
        print_success "Docker and Docker Compose (integrated) are available"
    elif command -v docker-compose &> /dev/null; then
        DOCKER_COMPOSE="docker-compose"
        print_success "Docker and Docker Compose (standalone) are available"
    else
        print_error "Docker Compose is not available. Please install Docker Compose first."
        print_info "For newer Docker versions, it's included. For older versions, install docker-compose separately."
        exit 1
    fi
}

# Development environment
dev() {
    print_info "Starting development environment..."
    $DOCKER_COMPOSE -f docker-compose.dev.yml down
    $DOCKER_COMPOSE -f docker-compose.dev.yml up --build
}

# Production environment  
prod() {
    print_info "Starting production environment..."
    $DOCKER_COMPOSE down
    $DOCKER_COMPOSE up --build
}

# Stop all services
stop() {
    print_info "Stopping all services..."
    $DOCKER_COMPOSE -f docker-compose.dev.yml down 2>/dev/null || true
    $DOCKER_COMPOSE down 2>/dev/null || true
    print_success "All services stopped"
}

# Clean up everything
clean() {
    print_warning "This will remove all containers, volumes, and images!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Cleaning up..."
        $DOCKER_COMPOSE -f docker-compose.dev.yml down -v 2>/dev/null || true
        $DOCKER_COMPOSE down -v 2>/dev/null || true
        docker rmi $(docker images -q levich-* 2>/dev/null) 2>/dev/null || true
        docker system prune -f
        print_success "Cleanup completed"
    else
        print_info "Cleanup cancelled"
    fi
}

# View logs
logs() {
    ENV=${1:-dev}
    if [ "$ENV" = "prod" ]; then
        $DOCKER_COMPOSE logs -f
    else
        $DOCKER_COMPOSE -f docker-compose.dev.yml logs -f
    fi
}

# Database operations
db_migrate() {
    print_info "Running database migrations..."
    docker exec -it levich-server-dev npx prisma migrate deploy 2>/dev/null || \
    docker exec -it levich-server npx prisma migrate deploy
    print_success "Migrations completed"
}

db_seed() {
    print_info "Seeding database..."
    docker exec -it levich-server-dev npm run db:seed 2>/dev/null || \
    docker exec -it levich-server npm run db:seed
    print_success "Database seeded"
}

db_reset() {
    print_warning "This will reset the database and lose all data!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Resetting database..."
        docker exec -it levich-server-dev npx prisma migrate reset --force 2>/dev/null || \
        docker exec -it levich-server npx prisma migrate reset --force
        print_success "Database reset completed"
    else
        print_info "Database reset cancelled"
    fi
}

# Health check
health() {
    print_info "Checking service health..."
    
    # Check database
    if docker exec levich-postgres pg_isready -U levich_user 2>/dev/null; then
        print_success "Database is healthy"
    else
        print_error "Database is not responding"
    fi
    
    # Check backend
    if curl -sf http://localhost:3001/health >/dev/null 2>&1; then
        print_success "Backend is healthy"
    else
        print_error "Backend is not responding"
    fi
    
    # Check frontend
    if curl -sf http://localhost:3000 >/dev/null 2>&1; then
        print_success "Frontend is healthy"
    else
        print_error "Frontend is not responding"
    fi
}

# Show help
help() {
    echo "Levich Interview Task - Docker Management"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  dev             Start development environment"
    echo "  prod            Start production environment"
    echo "  stop            Stop all services"
    echo "  clean           Clean up all Docker resources"
    echo "  logs [dev|prod] View logs (default: dev)"
    echo "  db:migrate      Run database migrations"
    echo "  db:seed         Seed database with sample data"
    echo "  db:reset        Reset database (WARNING: data loss)"
    echo "  health          Check service health"
    echo "  help            Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 dev          # Start development environment"
    echo "  $0 prod         # Start production environment"
    echo "  $0 logs dev     # View development logs"
    echo "  $0 db:seed      # Add sample data"
    echo "  $0 health       # Check if everything is running"
}

# Main script logic
check_docker

case "${1:-help}" in
    "dev")
        dev
        ;;
    "prod")
        prod
        ;;
    "stop")
        stop
        ;;
    "clean")
        clean
        ;;
    "logs")
        logs $2
        ;;
    "db:migrate")
        db_migrate
        ;;
    "db:seed")
        db_seed
        ;;
    "db:reset")
        db_reset
        ;;
    "health")
        health
        ;;
    "help"|*)
        help
        ;;
esac