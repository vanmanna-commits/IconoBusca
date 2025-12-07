import requests
import sys
import time
from datetime import datetime

class ImageSearchAPITester:
    def __init__(self, base_url="https://photo-search-6.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, params=None, timeout=30):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        if params:
            print(f"   Params: {params}")
        
        try:
            if method == 'GET':
                response = requests.get(url, params=params, headers=headers, timeout=timeout)
            elif method == 'POST':
                response = requests.post(url, json=params, headers=headers, timeout=timeout)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if 'total_results' in response_data:
                        print(f"   Results: {response_data['total_results']} images")
                    if 'search_time_ms' in response_data:
                        print(f"   Search time: {response_data['search_time_ms']:.0f}ms")
                except:
                    pass
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_detail = response.json()
                    print(f"   Error: {error_detail}")
                except:
                    print(f"   Response: {response.text[:200]}")
                self.failed_tests.append({
                    'name': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'endpoint': endpoint
                })

            return success, response.json() if success else {}

        except requests.exceptions.Timeout:
            print(f"❌ Failed - Request timeout after {timeout}s")
            self.failed_tests.append({
                'name': name,
                'error': 'Timeout',
                'endpoint': endpoint
            })
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                'name': name,
                'error': str(e),
                'endpoint': endpoint
            })
            return False, {}

    def test_health_check(self):
        """Test health endpoint"""
        return self.run_test("Health Check", "GET", "api/health", 200)

    def test_search_all_sources(self, query="nature"):
        """Test search with all sources"""
        params = {
            'query': query,
            'page': 1,
            'per_page': 20,
            'sources': 'unsplash,pexels,pixabay'
        }
        return self.run_test("Search All Sources", "GET", "api/search", 200, params)

    def test_search_individual_sources(self, query="nature"):
        """Test each source individually"""
        sources = ['unsplash', 'pexels', 'pixabay']
        results = {}
        
        for source in sources:
            params = {
                'query': query,
                'page': 1,
                'per_page': 10,
                'sources': source
            }
            success, response = self.run_test(f"Search {source.title()}", "GET", "api/search", 200, params)
            results[source] = {
                'success': success,
                'count': response.get('total_results', 0) if success else 0
            }
        
        return results

    def test_search_validation(self):
        """Test search parameter validation"""
        # Test empty query
        params = {'query': '', 'sources': 'unsplash'}
        self.run_test("Empty Query Validation", "GET", "api/search", 422, params)
        
        # Test invalid source
        params = {'query': 'test', 'sources': 'invalid_source'}
        self.run_test("Invalid Source Validation", "GET", "api/search", 400, params)
        
        # Test missing query
        params = {'sources': 'unsplash'}
        self.run_test("Missing Query Validation", "GET", "api/search", 422, params)

    def test_search_pagination(self, query="nature"):
        """Test pagination"""
        params = {
            'query': query,
            'page': 1,
            'per_page': 5,
            'sources': 'unsplash'
        }
        success1, response1 = self.run_test("Pagination Page 1", "GET", "api/search", 200, params)
        
        params['page'] = 2
        success2, response2 = self.run_test("Pagination Page 2", "GET", "api/search", 200, params)
        
        if success1 and success2:
            # Check if results are different (basic pagination test)
            images1 = [img['image_id'] for img in response1.get('images', [])]
            images2 = [img['image_id'] for img in response2.get('images', [])]
            if set(images1).intersection(set(images2)):
                print("⚠️  Warning: Some images appear on both pages")
            else:
                print("✅ Pagination working - different results on different pages")

    def test_response_structure(self, query="nature"):
        """Test API response structure"""
        params = {
            'query': query,
            'page': 1,
            'per_page': 5,
            'sources': 'unsplash'
        }
        success, response = self.run_test("Response Structure", "GET", "api/search", 200, params)
        
        if success:
            required_fields = ['query', 'total_results', 'images', 'search_time_ms']
            missing_fields = [field for field in required_fields if field not in response]
            
            if missing_fields:
                print(f"❌ Missing required fields: {missing_fields}")
                return False
            
            # Check image structure
            if response['images']:
                image = response['images'][0]
                image_fields = ['title', 'thumbnail_url', 'regular_url', 'photographer', 'source', 'source_url', 'download_url', 'license', 'image_id']
                missing_image_fields = [field for field in image_fields if field not in image]
                
                if missing_image_fields:
                    print(f"❌ Missing image fields: {missing_image_fields}")
                    return False
                else:
                    print("✅ All required image fields present")
            
            print("✅ Response structure is valid")
            return True
        
        return False

def main():
    print("🚀 Starting Image Search API Tests")
    print("=" * 50)
    
    tester = ImageSearchAPITester()
    
    # Basic health check
    print("\n📋 BASIC CONNECTIVITY TESTS")
    tester.test_health_check()
    
    # Search functionality tests
    print("\n📋 SEARCH FUNCTIONALITY TESTS")
    tester.test_search_all_sources("nature")
    
    # Individual source tests
    print("\n📋 INDIVIDUAL SOURCE TESTS")
    source_results = tester.test_search_individual_sources("landscape")
    
    # Validation tests
    print("\n📋 VALIDATION TESTS")
    tester.test_search_validation()
    
    # Pagination tests
    print("\n📋 PAGINATION TESTS")
    tester.test_search_pagination("ocean")
    
    # Response structure tests
    print("\n📋 RESPONSE STRUCTURE TESTS")
    tester.test_response_structure("mountain")
    
    # Different search terms
    print("\n📋 DIVERSE SEARCH TESTS")
    search_terms = ["technology", "food", "animals", "architecture"]
    for term in search_terms:
        tester.test_search_all_sources(term)
    
    # Print final results
    print("\n" + "=" * 50)
    print("📊 FINAL TEST RESULTS")
    print("=" * 50)
    print(f"Tests run: {tester.tests_run}")
    print(f"Tests passed: {tester.tests_passed}")
    print(f"Tests failed: {len(tester.failed_tests)}")
    print(f"Success rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    if tester.failed_tests:
        print("\n❌ FAILED TESTS:")
        for test in tester.failed_tests:
            error_msg = test.get('error', f"Expected {test.get('expected')}, got {test.get('actual')}")
            print(f"  - {test['name']}: {error_msg}")
    
    # Source-specific results
    print("\n📈 SOURCE PERFORMANCE:")
    if 'source_results' in locals():
        for source, result in source_results.items():
            status = "✅" if result['success'] else "❌"
            print(f"  {status} {source.title()}: {result['count']} images")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())